# Copyright (c) 2025 Sam Caldwell
# SPDX-License-Identifier: MIT
"""Tests for the versioning CLI tool."""



from pathlib import Path
import subprocess
import sys


SCRIPT_PATH = Path(__file__).resolve().parents[2] / "tools" / "versioning"


def run_tool(tmp_path, args):
    """Run the versioning tool with the given arguments inside tmp_path."""
    return subprocess.run(
        [sys.executable, str(SCRIPT_PATH), *args],
        cwd=tmp_path,
        capture_output=True,
        text=True,
        check=False,
    )


def test_help_message(tmp_path):
    """The tool should display usage information when no arguments are given."""
    result = run_tool(tmp_path, [])
    assert result.returncode == 0
    assert "usage" in result.stdout.lower()


def test_major_creates_file(tmp_path):
    """Invoking with 'major' should create VERSION with v1.0.0 when absent."""
    result = run_tool(tmp_path, ["major"])
    assert result.returncode == 0
    assert (tmp_path / "VERSION").read_text().strip() == "v1.0.0"


def test_minor_bump(tmp_path):
    """Invoking with 'minor' should increment the minor version and reset release."""
    version_file = tmp_path / "VERSION"
    version_file.write_text("v1.2.3")
    result = run_tool(tmp_path, ["minor"])
    assert result.returncode == 0
    assert version_file.read_text().strip() == "v1.3.0"


def test_release_bump(tmp_path):
    """Invoking with 'release' should increment the release version."""
    version_file = tmp_path / "VERSION"
    version_file.write_text("v1.2.3")
    result = run_tool(tmp_path, ["release"])
    assert result.returncode == 0
    assert version_file.read_text().strip() == "v1.2.4"
