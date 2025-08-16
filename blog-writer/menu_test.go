package main

import (
	"testing"

	"github.com/wailsapp/wails/v2/pkg/menu"
)

// TestNewAppMenuHelpItems ensures the help menu contains all expected entries.
func TestNewAppMenuHelpItems(t *testing.T) {
	app := NewApp()
	m := newAppMenu(app)

	// Locate the Help submenu
	var help *menu.Menu
	for _, item := range m.Items {
		if item.Label == "Help" && item.Type == menu.SubmenuType {
			help = item.SubMenu
			break
		}
	}
	if help == nil {
		t.Fatal("help submenu not found")
	}

	if len(help.Items) != 3 {
		t.Fatalf("expected 3 help items, got %d", len(help.Items))
	}

	expected := []string{"About", "Read the docs", "Report a bug"}
	for i, label := range expected {
		if help.Items[i].Label != label {
			t.Errorf("expected item %d label %q, got %q", i, label, help.Items[i].Label)
		}
		if help.Items[i].Click == nil {
			t.Errorf("item %q missing click handler", label)
		}
	}
}
