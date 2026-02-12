// src/db/schema.ts

export const SCHEMA_SQL = `
  -- Projects Table: Manages overall projects
  CREATE TABLE IF NOT EXISTS Projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    act_structure INTEGER DEFAULT 3,
    layout_direction TEXT DEFAULT 'vertical',
    primary_color TEXT DEFAULT '#000000',
    secondary_color TEXT DEFAULT '#ff0000',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Acts Table: Defines the main acts of a project
  CREATE TABLE IF NOT EXISTS Acts (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    act_number INTEGER NOT NULL,
    name TEXT,
    FOREIGN KEY (project_id) REFERENCES Projects(id) ON DELETE CASCADE
  );

  -- Scenes Table: The main container for story elements
  CREATE TABLE IF NOT EXISTS Scenes (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    act_id TEXT NOT NULL,
    scene_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    location TEXT,
    time_of_day TEXT,
    hero_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES Projects(id) ON DELETE CASCADE,
    FOREIGN KEY (act_id) REFERENCES Acts(id) ON DELETE CASCADE
  );

  -- Characters Table: Global character definitions
  CREATE TABLE IF NOT EXISTS Characters (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    name TEXT NOT NULL,
    age INTEGER,
    sex TEXT,
    origin TEXT,
    role TEXT,
    alignment TEXT,
    goal TEXT,
    first_appearance_scene_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES Projects(id) ON DELETE CASCADE
  );

  -- Events Table: Key moments or plot points
  CREATE TABLE IF NOT EXISTS Events (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    title TEXT NOT NULL,
    date TEXT,
    time TEXT,
    location TEXT,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES Projects(id) ON DELETE CASCADE
  );

  -- Actions Table: Script actions
  CREATE TABLE IF NOT EXISTS Actions (
    id TEXT PRIMARY KEY,
    scene_id TEXT NOT NULL,
    script_order INTEGER NOT NULL,
    description TEXT,
    theme_color TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (scene_id) REFERENCES Scenes(id) ON DELETE CASCADE
  );

  -- Dialogues Table: Script dialogues
  CREATE TABLE IF NOT EXISTS Dialogues (
    id TEXT PRIMARY KEY,
    scene_id TEXT NOT NULL,
    script_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (scene_id) REFERENCES Scenes(id) ON DELETE CASCADE
  );

  -- Dialogue_Characters Junction Table: Links characters to dialogues
  CREATE TABLE IF NOT EXISTS Dialogue_Characters (
    dialogue_id TEXT NOT NULL,
    character_id TEXT NOT NULL,
    PRIMARY KEY (dialogue_id, character_id),
    FOREIGN KEY (dialogue_id) REFERENCES Dialogues(id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES Characters(id) ON DELETE CASCADE
  );

  -- Sticky_Notes Table: For inspiration boards
  CREATE TABLE IF NOT EXISTS Sticky_Notes (
    id TEXT PRIMARY KEY,
    board_id TEXT NOT NULL, -- Can be a Scene, Character, or Event ID
    board_type TEXT NOT NULL, -- 'Scene', 'Character', or 'Event'
    content TEXT,
    color TEXT DEFAULT 'yellow',
    position_x REAL,
    position_y REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Images Table: For inspiration boards
  CREATE TABLE IF NOT EXISTS Images (
    id TEXT PRIMARY KEY,
    board_id TEXT NOT NULL, -- Can be a Scene, Character, or Event ID
    board_type TEXT NOT NULL, -- 'Scene', 'Character', or 'Event'
    image_url TEXT NOT NULL,
    position_x REAL,
    position_y REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Inspiration_Board_Characters Junction Table
  CREATE TABLE IF NOT EXISTS Inspiration_Board_Characters (
    board_id TEXT NOT NULL, -- Scene ID
    character_id TEXT NOT NULL,
    position_x REAL,
    position_y REAL,
    PRIMARY KEY (board_id, character_id),
    FOREIGN KEY (board_id) REFERENCES Scenes(id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES Characters(id) ON DELETE CASCADE
  );

  -- Inspiration_Board_Events Junction Table
  CREATE TABLE IF NOT EXISTS Inspiration_Board_Events (
    board_id TEXT NOT NULL, -- Scene ID
    event_id TEXT NOT NULL,
    position_x REAL,
    position_y REAL,
    PRIMARY KEY (board_id, event_id),
    FOREIGN KEY (board_id) REFERENCES Scenes(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Events(id) ON DELETE CASCADE
  );

  -----------------------------------------------------------------------------
  -- TRIGGERS FOR Project.last_modified TIMESTAMP
  -----------------------------------------------------------------------------

  -- Update Project.last_modified when the Project itself is updated
  CREATE TRIGGER IF NOT EXISTS trg_projects_last_modified_update
  AFTER UPDATE ON Projects
  FOR EACH ROW
  BEGIN
    UPDATE Projects SET last_modified = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

  -- Generic trigger to update Project.last_modified based on project_id
  CREATE TRIGGER IF NOT EXISTS trg_acts_update_project
  AFTER INSERT ON Acts FOR EACH ROW
  BEGIN UPDATE Projects SET last_modified = CURRENT_TIMESTAMP WHERE id = NEW.project_id; END;
  CREATE TRIGGER IF NOT EXISTS trg_acts_update_project_upd
  AFTER UPDATE ON Acts FOR EACH ROW
  BEGIN UPDATE Projects SET last_modified = CURRENT_TIMESTAMP WHERE id = NEW.project_id; END;
  CREATE TRIGGER IF NOT EXISTS trg_acts_update_project_del
  AFTER DELETE ON Acts FOR EACH ROW
  BEGIN UPDATE Projects SET last_modified = CURRENT_TIMESTAMP WHERE id = OLD.project_id; END;

  CREATE TRIGGER IF NOT EXISTS trg_scenes_update_project
  AFTER INSERT ON Scenes FOR EACH ROW
  BEGIN UPDATE Projects SET last_modified = CURRENT_TIMESTAMP WHERE id = NEW.project_id; END;
  CREATE TRIGGER IF NOT EXISTS trg_scenes_update_project_upd
  AFTER UPDATE ON Scenes FOR EACH ROW
  BEGIN UPDATE Projects SET last_modified = CURRENT_TIMESTAMP WHERE id = NEW.project_id; END;
  CREATE TRIGGER IF NOT EXISTS trg_scenes_update_project_del
  AFTER DELETE ON Scenes FOR EACH ROW
  BEGIN UPDATE Projects SET last_modified = CURRENT_TIMESTAMP WHERE id = OLD.project_id; END;

  CREATE TRIGGER IF NOT EXISTS trg_characters_update_project
  AFTER INSERT ON Characters FOR EACH ROW
  BEGIN UPDATE Projects SET last_modified = CURRENT_TIMESTAMP WHERE id = NEW.project_id; END;
  CREATE TRIGGER IF NOT EXISTS trg_characters_update_project_upd
  AFTER UPDATE ON Characters FOR EACH ROW
  BEGIN UPDATE Projects SET last_modified = CURRENT_TIMESTAMP WHERE id = NEW.project_id; END;
  CREATE TRIGGER IF NOT EXISTS trg_characters_update_project_del
  AFTER DELETE ON Characters FOR EACH ROW
  BEGIN UPDATE Projects SET last_modified = CURRENT_TIMESTAMP WHERE id = OLD.project_id; END;

  CREATE TRIGGER IF NOT EXISTS trg_events_update_project
  AFTER INSERT ON Events FOR EACH ROW
  BEGIN UPDATE Projects SET last_modified = CURRENT_TIMESTAMP WHERE id = NEW.project_id; END;
  CREATE TRIGGER IF NOT EXISTS trg_events_update_project_upd
  AFTER UPDATE ON Events FOR EACH ROW
  BEGIN UPDATE Projects SET last_modified = CURRENT_TIMESTAMP WHERE id = NEW.project_id; END;
  CREATE TRIGGER IF NOT EXISTS trg_events_update_project_del
  AFTER DELETE ON Events FOR EACH ROW
  BEGIN UPDATE Projects SET last_modified = CURRENT_TIMESTAMP WHERE id = OLD.project_id; END;

  -- Triggers for tables linked to Scenes (Actions, Dialogues)
  CREATE TRIGGER IF NOT EXISTS trg_actions_update_project
  AFTER INSERT ON Actions FOR EACH ROW
  BEGIN UPDATE Projects SET last_modified = CURRENT_TIMESTAMP WHERE id = (SELECT project_id FROM Scenes WHERE id = NEW.scene_id); END;
  CREATE TRIGGER IF NOT EXISTS trg_actions_update_project_upd
  AFTER UPDATE ON Actions FOR EACH ROW
  BEGIN UPDATE Projects SET last_modified = CURRENT_TIMESTAMP WHERE id = (SELECT project_id FROM Scenes WHERE id = NEW.scene_id); END;
  CREATE TRIGGER IF NOT EXISTS trg_actions_update_project_del
  AFTER DELETE ON Actions FOR EACH ROW
  BEGIN UPDATE Projects SET last_modified = CURRENT_TIMESTAMP WHERE id = (SELECT project_id FROM Scenes WHERE id = OLD.scene_id); END;

  CREATE TRIGGER IF NOT EXISTS trg_dialogues_update_project
  AFTER INSERT ON Dialogues FOR EACH ROW
  BEGIN UPDATE Projects SET last_modified = CURRENT_TIMESTAMP WHERE id = (SELECT project_id FROM Scenes WHERE id = NEW.scene_id); END;
  CREATE TRIGGER IF NOT EXISTS trg_dialogues_update_project_upd
  AFTER UPDATE ON Dialogues FOR EACH ROW
  BEGIN UPDATE Projects SET last_modified = CURRENT_TIMESTAMP WHERE id = (SELECT project_id FROM Scenes WHERE id = NEW.scene_id); END;
  CREATE TRIGGER IF NOT EXISTS trg_dialogues_update_project_del
  AFTER DELETE ON Dialogues FOR EACH ROW
  BEGIN UPDATE Projects SET last_modified = CURRENT_TIMESTAMP WHERE id = (SELECT project_id FROM Scenes WHERE id = OLD.scene_id); END;

  -- Triggers for polymorphic tables (Sticky_Notes, Images)
  CREATE TRIGGER IF NOT EXISTS trg_sticky_notes_update_project
  AFTER INSERT ON Sticky_Notes FOR EACH ROW
  BEGIN
    UPDATE Projects SET last_modified = CURRENT_TIMESTAMP WHERE id = (
      CASE NEW.board_type
        WHEN 'Scene' THEN (SELECT project_id FROM Scenes WHERE id = NEW.board_id)
        WHEN 'Character' THEN (SELECT project_id FROM Characters WHERE id = NEW.board_id)
        WHEN 'Event' THEN (SELECT project_id FROM Events WHERE id = NEW.board_id)
      END
    );
  END;
  CREATE TRIGGER IF NOT EXISTS trg_sticky_notes_update_project_upd
  AFTER UPDATE ON Sticky_Notes FOR EACH ROW
  BEGIN
    UPDATE Projects SET last_modified = CURRENT_TIMESTAMP WHERE id = (
      CASE NEW.board_type
        WHEN 'Scene' THEN (SELECT project_id FROM Scenes WHERE id = NEW.board_id)
        WHEN 'Character' THEN (SELECT project_id FROM Characters WHERE id = NEW.board_id)
        WHEN 'Event' THEN (SELECT project_id FROM Events WHERE id = NEW.board_id)
      END
    );
  END;
  CREATE TRIGGER IF NOT EXISTS trg_sticky_notes_update_project_del
  AFTER DELETE ON Sticky_Notes FOR EACH ROW
  BEGIN
    UPDATE Projects SET last_modified = CURRENT_TIMESTAMP WHERE id = (
      CASE OLD.board_type
        WHEN 'Scene' THEN (SELECT project_id FROM Scenes WHERE id = OLD.board_id)
        WHEN 'Character' THEN (SELECT project_id FROM Characters WHERE id = OLD.board_id)
        WHEN 'Event' THEN (SELECT project_id FROM Events WHERE id = OLD.board_id)
      END
    );
  END;

  CREATE TRIGGER IF NOT EXISTS trg_images_update_project
  AFTER INSERT ON Images FOR EACH ROW
  BEGIN
    UPDATE Projects SET last_modified = CURRENT_TIMESTAMP WHERE id = (
      CASE NEW.board_type
        WHEN 'Scene' THEN (SELECT project_id FROM Scenes WHERE id = NEW.board_id)
        WHEN 'Character' THEN (SELECT project_id FROM Characters WHERE id = NEW.board_id)
        WHEN 'Event' THEN (SELECT project_id FROM Events WHERE id = NEW.board_id)
      END
    );
  END;
  CREATE TRIGGER IF NOT EXISTS trg_images_update_project_upd
  AFTER UPDATE ON Images FOR EACH ROW
  BEGIN
    UPDATE Projects SET last_modified = CURRENT_TIMESTAMP WHERE id = (
      CASE NEW.board_type
        WHEN 'Scene' THEN (SELECT project_id FROM Scenes WHERE id = NEW.board_id)
        WHEN 'Character' THEN (SELECT project_id FROM Characters WHERE id = NEW.board_id)
        WHEN 'Event' THEN (SELECT project_id FROM Events WHERE id = NEW.board_id)
      END
    );
  END;
  CREATE TRIGGER IF NOT EXISTS trg_images_update_project_del
  AFTER DELETE ON Images FOR EACH ROW
  BEGIN
    UPDATE Projects SET last_modified = CURRENT_TIMESTAMP WHERE id = (
      CASE OLD.board_type
        WHEN 'Scene' THEN (SELECT project_id FROM Scenes WHERE id = OLD.board_id)
        WHEN 'Character' THEN (SELECT project_id FROM Characters WHERE id = OLD.board_id)
        WHEN 'Event' THEN (SELECT project_id FROM Events WHERE id = OLD.board_id)
      END
    );
  END;
`;
