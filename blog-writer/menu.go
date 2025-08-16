// Copyright (c) 2025 Asymmetric Effort, LLC. <scaldwell@asymmetric-effort.com>
package main

import "github.com/wailsapp/wails/v2/pkg/menu"

// newAppMenu constructs the application menu including a Help submenu with
// entries for About, documentation, and bug reporting.
func newAppMenu(app *App) *menu.Menu {
	appMenu := menu.NewMenu()
	helpMenu := appMenu.AddSubmenu("Help")
	helpMenu.AddText("About", nil, app.ShowAbout)
	helpMenu.AddText("Read the docs", nil, app.ShowDocs)
	helpMenu.AddText("Report a bug", nil, app.ReportBug)
	return appMenu
}
