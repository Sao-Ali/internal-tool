package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"
)

/* ---------- Upstream (MLB StatsAPI) shapes: only fields we use ---------- */

type scheduleResp struct {
	Dates []struct {
		Games []struct {
			GameDate string `json:"gameDate,omitempty"`
			Venue    struct {
				Name string `json:"name,omitempty"`
			} `json:"venue,omitempty"`
			Status struct {
				CodedGameState string `json:"codedGameState"`     // "S" scheduled, "I" in-progress, "F" final
				DetailedState  string `json:"detailedState,omitempty"`
			} `json:"status"`
			Teams struct {
				Home struct {
					Team struct {
						ID   int    `json:"id"`
						Name string `json:"name,omitempty"`
					} `json:"team"`
					IsWinner     bool `json:"isWinner"`
					Score        int  `json:"score,omitempty"`
					LeagueRecord struct {
						Wins   int    `json:"wins"`
						Losses int    `json:"losses"`
						Pct    string `json:"pct"`
					} `json:"leagueRecord"`
				} `json:"home"`
				Away struct {
					Team struct {
						ID   int    `json:"id"`
						Name string `json:"name,omitempty"`
					} `json:"team"`
					IsWinner     bool `json:"isWinner"`
					Score        int  `json:"score,omitempty"`
					LeagueRecord struct {
						Wins   int    `json:"wins"`
						Losses int    `json:"losses"`
						Pct    string `json:"pct"`
					} `json:"leagueRecord"`
				} `json:"away"`
			} `json:"teams"`
		} `json:"games"`
	} `json:"dates"`
}

/* ---------- Our API response types ---------- */

type teamSide struct {
	Name   string `json:"name,omitempty"`
	Abbr   string `json:"abbr,omitempty"`
	Score  int    `json:"score,omitempty"`
	Wins   int    `json:"wins,omitempty"`
	Losses int    `json:"losses,omitempty"`
	Home   bool   `json:"home"`
	Winner bool   `json:"winner,omitempty"`
}

type gameRich struct {
	Date   string   `json:"date,omitempty"`
	Venue  string   `json:"venue,omitempty"`
	Status string   `json:"status,omitempty"` // e.g., "SCHEDULED" | "IN_PROGRESS" | "FINAL" | detailed state
	Home   teamSide `json:"home"`
	Away   teamSide `json:"away"`
}

type result struct {
	DateChecked string    `json:"dateChecked"`
	Live        bool      `json:"live"`
	Error       string    `json:"error,omitempty"`
	Game        *gameRich `json:"game,omitempty"`
}

/* ---------- Config / globals ---------- */

const dodgersID = 119

var httpClient = &http.Client{
	Timeout: 6 * time.Second,
}

/* ---------- Helpers ---------- */

func yesterdayPT() (string, error) {
	loc, err := time.LoadLocation("America/Los_Angeles")
	if err != nil {
		return "", err
	}
	return time.Now().In(loc).AddDate(0, 0, -1).Format("2006-01-02"), nil
}

func statusLabel(code, detailed string) string {
	if detailed != "" {
		return detailed
	}
	switch code {
	case "S":
		return "SCHEDULED"
	case "I":
		return "IN_PROGRESS"
	case "F":
		return "FINAL"
	default:
		return code
	}
}

func shortName(name string) string {
	switch name {
	case "Atlanta Braves":
		return "ATL"
	case "San Francisco Giants":
		return "SF"
	case "San Diego Padres":
		return "SD"
	case "Arizona Diamondbacks":
		return "ARI"
	case "Colorado Rockies":
		return "COL"
	case "New York Yankees":
		return "NYY"
	case "New York Mets":
		return "NYM"
	case "Chicago Cubs":
		return "CHC"
	case "Chicago White Sox":
		return "CWS"
	case "Pittsburgh Pirates":
		return "PIT"
	case "Los Angeles Dodgers":
		return "LAD"
	default:
		// Fallback: take first letters of first 2–3 words
		runes := []rune(name)
		if len(runes) >= 3 {
			return string(runes[0]) + string(runes[1]) + string(runes[2])
		}
		return name
	}
}

/* ---------- HTTP handler ---------- */

func handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")

	// Optional ?date=YYYY-MM-DD (for testing); default to yesterday PT
	dateStr := r.URL.Query().Get("date")
	if dateStr == "" {
		var err error
		dateStr, err = yesterdayPT()
		if err != nil {
			_ = json.NewEncoder(w).Encode(result{Live: false, Error: "tz_error"})
			return
		}
	}

	// Hydrate linescore (scores) + venue + team to get everything we need
	url := "https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=" + dateStr + "&teamId=119&hydrate=venue,linescore,team"
	req, _ := http.NewRequestWithContext(r.Context(), "GET", url, nil)

	resp, err := httpClient.Do(req)
	if err != nil {
		_ = json.NewEncoder(w).Encode(result{DateChecked: dateStr, Live: false, Error: "fetch_error"})
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode > 299 {
		_ = json.NewEncoder(w).Encode(result{DateChecked: dateStr, Live: false, Error: "statsapi_error"})
		return
	}

	var s scheduleResp
	if err := json.NewDecoder(resp.Body).Decode(&s); err != nil {
		_ = json.NewEncoder(w).Encode(result{DateChecked: dateStr, Live: false, Error: "decode_error"})
		return
	}

	live := false
	var outGame *gameRich

	if len(s.Dates) > 0 {
		for _, g := range s.Dates[0].Games {
			homeID := g.Teams.Home.Team.ID
			awayID := g.Teams.Away.Team.ID
			if homeID != dodgersID && awayID != dodgersID {
				continue // not a Dodgers game
			}

			status := statusLabel(g.Status.CodedGameState, g.Status.DetailedState)

			// YES only if Final + Dodgers were HOME + won
			if homeID == dodgersID && g.Status.CodedGameState == "F" && g.Teams.Home.IsWinner {
				live = true
			}

			home := teamSide{
				Name:   g.Teams.Home.Team.Name,
				Abbr:   shortName(g.Teams.Home.Team.Name),
				Score:  g.Teams.Home.Score,
				Wins:   g.Teams.Home.LeagueRecord.Wins,
				Losses: g.Teams.Home.LeagueRecord.Losses,
				Home:   true,
				Winner: g.Teams.Home.IsWinner,
			}
			away := teamSide{
				Name:   g.Teams.Away.Team.Name,
				Abbr:   shortName(g.Teams.Away.Team.Name),
				Score:  g.Teams.Away.Score,
				Wins:   g.Teams.Away.LeagueRecord.Wins,
				Losses: g.Teams.Away.LeagueRecord.Losses,
				Home:   false,
				Winner: g.Teams.Away.IsWinner,
			}

			outGame = &gameRich{
				Date:   dateStr,
				Venue:  g.Venue.Name,
				Status: status,
				Home:   home,
				Away:   away,
			}
			break
		}
	}

	_ = json.NewEncoder(w).Encode(result{
		DateChecked: dateStr,
		Live:        live,
		Game:        outGame,
	})
}

/* ---------- Server ---------- */

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/panda", handler)
	mux.HandleFunc("/healthz", func(w http.ResponseWriter, _ *http.Request) {
		_, _ = w.Write([]byte("ok"))
	})

	log.Println("Go API on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}

/* ---------- (Optional) helpers you might want later ---------- */

// makeScorelineFromPerspective returns "LAD x–y OPP" given scores and whether LAD is home.
// Not used by the rich card UI (which shows split scores), but handy for text lines.
func makeScorelineFromPerspective(ladIsHome bool, homeScore, awayScore int, oppAbbr string) string {
	var lad, opp int
	if ladIsHome {
		lad, opp = homeScore, awayScore
	} else {
		lad, opp = awayScore, homeScore
	}
	return "LAD " + strconv.Itoa(lad) + "–" + strconv.Itoa(opp) + " " + oppAbbr
}

