-- create_note.scpt
on run argv
    set noteTitle to item 1 of argv
    set noteBody to item 2 of argv

    tell application "Notes"
        tell account "iCloud"
            if not (exists folder "Notion Transfer") then
                make new folder with properties {name:"Notion Transfer"}
            end if

            tell folder "Notion Transfer"
                make new note with properties {name:noteTitle, body:noteBody}
            end tell
        end tell
    end tell
end run
