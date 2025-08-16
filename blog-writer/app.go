// Copyright (c) 2025 Asymmetric Effort, LLC. <scaldwell@asymmetric-effort.com>
package main

import (
	"context"
	"fmt"

	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/runtime"

	"blog-writer/internal/about"
)

// App holds application state.
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct.
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods.
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name.
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// ShowAbout displays the application's about information.
func (a *App) ShowAbout(data *menu.CallbackData) {
	runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
		Title:   "About",
		Message: about.Info(),
		Icon:    about.Icon(),
	})
}

// ShowDocs opens the project documentation in the user's default browser.
func (a *App) ShowDocs(data *menu.CallbackData) {
	runtime.BrowserOpenURL(a.ctx, "https://github.com/asymmetric-effort/blog-writer/blob/main/docs/user-guide.md")
}

// ReportBug opens the bug report page in the user's default browser.
func (a *App) ReportBug(data *menu.CallbackData) {
	runtime.BrowserOpenURL(a.ctx, "https://github.com/asymmetric-effort/blog-writer/issues/new/choose")
}
