// Copyright (c) 2025 Asymmetric Effort, LLC. <scaldwell@asymmetric-effort.com>
package main

import (
	"embed"

	wails "github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"

	"blog-writer/internal/services"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create services
	app := NewApp()
       repoSvc, err := services.NewRepoService()
       if err != nil {
               println("Error:", err.Error())
               return
       }
       treeSvc := services.NewTreeService()

	// Create application menu.
	appMenu := menu.NewMenu()
	helpMenu := appMenu.AddSubmenu("Help")
	helpMenu.AddText("About", nil, app.ShowAbout)

	// Create application with options.
	err = wails.Run(&options.App{
		Title:  "Blog-Writer",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		Menu:             appMenu,
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
               Bind: []interface{}{
                       app,
                       repoSvc,
                       treeSvc,
               },
       })

	if err != nil {
		println("Error:", err.Error())
	}
}
