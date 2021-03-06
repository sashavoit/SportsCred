package apis

import (
	"back-end/queries"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
)

func SetUpPicks(app *gin.Engine, driver neo4j.Driver) {

	const regularUpd = 5 * time.Second

	app.GET("/picks/dailyPicks", CheckAuthToken(func(c *gin.Context, email string) {
		conference := c.DefaultQuery("conference", "")
		result, err := queries.GetDailyPicks(driver, email, conference)
		if err != nil {
			c.String(500, "Internal server error")
			return
		} else if result == nil {
			c.String(404, "Not found")
			return
		}
		//fmt.Print(result)
		c.JSON(200, result)
	}))

	app.GET("/picks/ifMadePrediction", CheckAuthToken(func(c *gin.Context, email string) {
		result, err := queries.IfMadePrediction(driver, email)
		if err != nil {
			fmt.Print(err)
			c.String(500, "Internal server error")
			return
		}

		c.JSON(200, result)

	}))

	app.POST("/picks/newPrediction", CheckAuthToken(func(c *gin.Context, email string) {
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		type Data struct {
			GameId int    `json:"game_id"`
			Winner string `json:"winner"`
		}
		var data Data
		json.Unmarshal(jsonData, &data)

		_, err = queries.AddNewPrediction(driver, email, data.GameId, data.Winner)
		if err != nil {
			c.String(500, "Internal server error")
			return
		}

		//TODO remove after the demo
		//Setting a timer for the purpose of the demo
		go func() {
			time.Sleep(regularUpd)
			team1Init, team2Init, winner, err := queries.GetGameById(driver, data.GameId)
			if err != nil {
				panic(err)
			}

			var isCorrect string
			var notifType string

			if winner == data.Winner {
				queries.UpdateACS(driver, email, 1, false, false)
				isCorrect = "correct (ACS +1)"
				notifType = "success"
			} else {
				queries.UpdateACS(driver, email, -1, false, false)
				isCorrect = "incorrect (ACS -1)"
				notifType = "error"
			}

			SendNotif(email, team1Init+" vs. "+team2Init, "Your prediction is "+isCorrect, notifType)

		}()

		c.JSON(200, nil)
	}))

	app.POST("/picks/addGame", CheckAuthToken(func(c *gin.Context, _ string) {
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		type Data struct {
			Team1Name  string `json:"team1_name"`
			Team2Name  string `json:"team2_name"`
			Team1Init  string `json:"team1_init"`
			Team2Init  string `json:"team2_init"`
			Date       string `json:"date"`
			Winner     string `json:"winner"`
			Team1Logo  string `json:"team1_logo"`
			Team2Logo  string `json:"team2_logo"`
			Team1City  string `json:"team1_city"`
			Team2City  string `json:"team2_city"`
			Conference string `json:"conference"`
		}
		var data Data
		json.Unmarshal(jsonData, &data)

		result, err := queries.AddGame(driver, data.Team1Init, data.Team1Name, data.Team2Init, data.Team2Name, data.Date, "",
			data.Team1Logo, data.Team2Logo, data.Team1City, data.Team2City, data.Conference)

		if err != nil {
			c.String(500, "Internal server error")
			return
		}

		c.JSON(200, result)
	}))

	/*
		app.PATCH("/picks/updGameOutcome", CheckAuthToken(func(c *gin.Context, _ string){
			jsonData, err := ioutil.ReadAll(c.Request.Body)
			type Data struct {
				GameId int    `json:"game_id"`
				Winner string `json:"winner"`
			}
			var data Data
			json.Unmarshal(jsonData, &data)

			_, err = queries.AddGameOutcome(driver, data.GameId, data.Winner)
			if err != nil {
				c.String(500, "Internal server error")
				return
			}

			c.JSON(200, nil)
		}))
	*/
	demoScript(driver)
}

//TODO remove after the demo
func demoScript(driver neo4j.Driver) {

	queries.ClearGamesInDB(driver)

	queries.AddGame(driver, "UTA", "Utah Jazz", "NOP", "New Orleans Pelicans", "2021-1-12", "UTA",
		"https://ssl.gstatic.com/onebox/media/sports/logos/SP_dsmXEKFVZH5N1DQpZ4A_96x96.png",
		"https://ssl.gstatic.com/onebox/media/sports/logos/JCQO978-AWbg00TQUNPUVg_96x96.png",
		"https://i.pinimg.com/originals/94/ca/a5/94caa568233f04d0aa104d1be739c650.jpg",
		"https://i.pinimg.com/originals/37/bd/ff/37bdff0cb56f8b2f34e395121c7019ff.jpg",
		"western",
	)
	queries.AddGame(driver, "LAC", "Los Angeles Clippers", "LAL", "Los Angeles Lakers", "2021-1-12", "LAL",
		"https://ssl.gstatic.com/onebox/media/sports/logos/F36nQLCQ2FND3za-Eteeqg_96x96.png",
		"https://ssl.gstatic.com/onebox/media/sports/logos/4ndR-n-gall7_h3f7NYcpQ_96x96.png",
		"https://cdn.wallpapersafari.com/8/37/AIVuoY.jpg",
		"https://cdn.wallpapersafari.com/8/37/AIVuoY.jpg",
		"western")
	queries.AddGame(driver, "ORL", "Orlando Magic", "BKN", "Brooklyn Nets", "2021-1-12", "ORL",
		"https://ssl.gstatic.com/onebox/media/sports/logos/p69oiJ4LDsvCJUDQ3wR9PQ_96x96.png",
		"https://ssl.gstatic.com/onebox/media/sports/logos/iishUmO7vbJBE7iK2CZCdw_96x96.png",
		"https://wallpapercave.com/wp/wp4117350.jpg",
		"https://wallpapercave.com/wp/wp4663832.jpg",
		"eastern")
	queries.AddGame(driver, "MEM", "Memphis Grizzlies", "POR", "Portland Trailblazers", "2021-1-12", "POR",
		"https://ssl.gstatic.com/onebox/media/sports/logos/3ho45P8yNw-WmQ2m4A4TIA_96x96.png",
		"https://ssl.gstatic.com/onebox/media/sports/logos/_bgagBCd6ieOIt3INWRN_w_96x96.png",
		"https://static.wixstatic.com/media/fa3a6a_174653be72ad4c22923fc7e6adced1e5.jpg",
		"https://traveloregon.com/wp-content/uploads/2012/07/2200025-Edit.jpg",
		"western")
	queries.AddGame(driver, "PHX", "Phoenix Suns", "WAS", "Washington Wizards", "2021-1-12", "PHX",
		"https://ssl.gstatic.com/onebox/media/sports/logos/pRr87i24KHWH0UuAc5EamQ_96x96.png",
		"https://ssl.gstatic.com/onebox/media/sports/logos/NBkMJapxft4V5kvufec4Jg_96x96.png",
		"https://i.pinimg.com/originals/64/c4/c4/64c4c4b5065f252f44aa04aacbcd8629.jpg",
		"https://i.pinimg.com/originals/5c/31/01/5c310196ca8ddd2ef90c9ef1d718873d.jpg",
		"western")

}
