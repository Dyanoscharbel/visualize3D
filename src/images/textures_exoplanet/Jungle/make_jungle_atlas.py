import json
import os
from PIL import Image

# Configuration
INPUT_FILES = [
    "Jungle01.png",
    "Jungle02.png",
    "Jungle03.png",
    "Jungle04.png",
    "Jungle05.png",
]
COLUMNS = 3
ROWS = 2
PADDING = 4  # pixels around and between tiles
OUTPUT_IMAGE = "Jungle_atlas.png"
OUTPUT_JSON = "Jungle_atlas.json"


def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))

    # Load images, keeping only those that exist
    tiles = []
    for name in INPUT_FILES:
        path = os.path.join(base_dir, name)
        if not os.path.isfile(path):
            print(f"Warning: missing file {name}, skipping.")
            tiles.append(None)
            continue
        img = Image.open(path).convert("RGBA")
        tiles.append({
            "name": name,
            "image": img,
            "w": img.width,
            "h": img.height,
        })

    # Place up to ROWS*COLUMNS tiles
    max_tiles = COLUMNS * ROWS
    if len(tiles) > max_tiles:
        tiles = tiles[:max_tiles]
    else:
        # Pad list to full grid length with None
        tiles += [None] * (max_tiles - len(tiles))

    # Compute column widths and row heights (max per column/row)
    col_widths = [0] * COLUMNS
    row_heights = [0] * ROWS
    for idx, tile in enumerate(tiles):
        r = idx // COLUMNS
        c = idx % COLUMNS
        if tile is None:
            continue
        col_widths[c] = max(col_widths[c], tile["w"])
        row_heights[r] = max(row_heights[r], tile["h"])

    # Compute atlas size with padding around and between
    total_width = PADDING + sum(col_widths) + (COLUMNS * PADDING)
    total_height = PADDING + sum(row_heights) + (ROWS * PADDING)

    # Compute x offsets for each column and y offsets for each row
    x_offsets = []
    acc = PADDING
    for cw in col_widths:
        x_offsets.append(acc)
        acc += cw + PADDING

    y_offsets = []
    acc = PADDING
    for rh in row_heights:
        y_offsets.append(acc)
        acc += rh + PADDING

    # Create atlas and paste tiles
    atlas = Image.new("RGBA", (total_width, total_height), (0, 0, 0, 0))

    frames = {}
    for idx, tile in enumerate(tiles):
        r = idx // COLUMNS
        c = idx % COLUMNS
        x = x_offsets[c]
        y = y_offsets[r]
        if tile is None:
            continue
        img = tile["image"]
        atlas.paste(img, (x, y))
        frames[tile["name"]] = {
            "frame": {"x": x, "y": y, "w": tile["w"], "h": tile["h"]},
            "rotated": False,
            "trimmed": False,
            "spriteSourceSize": {"x": 0, "y": 0, "w": tile["w"], "h": tile["h"]},
            "sourceSize": {"w": tile["w"], "h": tile["h"]},
        }

    # Save outputs
    out_img_path = os.path.join(base_dir, OUTPUT_IMAGE)
    out_json_path = os.path.join(base_dir, OUTPUT_JSON)
    atlas.save(out_img_path, format="PNG")

    meta = {
        "app": "Cascade Atlas Builder",
        "version": 1,
        "image": OUTPUT_IMAGE,
        "size": {"w": total_width, "h": total_height},
        "scale": "1",
        "padding": PADDING,
        "grid": {"columns": COLUMNS, "rows": ROWS},
    }

    data = {"frames": frames, "meta": meta}
    with open(out_json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Wrote {OUTPUT_IMAGE} and {OUTPUT_JSON}")


if __name__ == "__main__":
    main()
