import json
import os
import re
from PIL import Image

PAIR_REGEX = re.compile(r"Gaseous_(\d+)-(0|1)\.png$")
OUTPUT_SINGLE_PATTERN = "Gaseous{num:02d}.png"
ATLAS_PNG = "Gaseous_atlas.png"
ATLAS_JSON = "Gaseous_atlas.json"
PADDING = 4
COLUMNS = 4
ROWS = 3  # up to 12 slots; we currently have up to 10 pairs


def find_pairs(base_dir):
    files = [f for f in os.listdir(base_dir) if f.lower().endswith('.png')]
    groups = {}
    for f in files:
        m = PAIR_REGEX.match(f)
        if not m:
            continue
        idx = int(m.group(1))
        part = int(m.group(2))
        groups.setdefault(idx, {})[part] = f
    # keep only pairs that have both parts
    pairs = []
    for idx, parts in sorted(groups.items()):
        if 0 in parts and 1 in parts:
            pairs.append((idx, parts[0], parts[1]))
    return pairs


def composite_pair(base_dir, file0, file1, output_path):
    img0 = Image.open(os.path.join(base_dir, file0)).convert('RGBA')
    img1 = Image.open(os.path.join(base_dir, file1)).convert('RGBA')
    if img1.size != img0.size:
        img1 = img1.resize(img0.size, Image.LANCZOS)
    # Place -1 over -0
    out = Image.alpha_composite(img0, img1)
    out.save(output_path, format='PNG')


def build_atlas(base_dir, output_files):
    # Load images
    tiles = []
    for name in output_files:
        path = os.path.join(base_dir, name)
        if not os.path.isfile(path):
            tiles.append(None)
            continue
        img = Image.open(path).convert('RGBA')
        tiles.append({
            'name': name,
            'image': img,
            'w': img.width,
            'h': img.height,
        })

    max_tiles = COLUMNS * ROWS
    if len(tiles) > max_tiles:
        tiles = tiles[:max_tiles]
    else:
        tiles += [None] * (max_tiles - len(tiles))

    col_widths = [0] * COLUMNS
    row_heights = [0] * ROWS
    for idx, tile in enumerate(tiles):
        r = idx // COLUMNS
        c = idx % COLUMNS
        if tile is None:
            continue
        col_widths[c] = max(col_widths[c], tile['w'])
        row_heights[r] = max(row_heights[r], tile['h'])

    total_width = PADDING + sum(col_widths) + (COLUMNS * PADDING)
    total_height = PADDING + sum(row_heights) + (ROWS * PADDING)

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

    atlas = Image.new('RGBA', (total_width, total_height), (0, 0, 0, 0))

    frames = {}
    for idx, tile in enumerate(tiles):
        r = idx // COLUMNS
        c = idx % COLUMNS
        x = x_offsets[c]
        y = y_offsets[r]
        if tile is None:
            continue
        img = tile['image']
        atlas.paste(img, (x, y))
        frames[tile['name']] = {
            'frame': {'x': x, 'y': y, 'w': tile['w'], 'h': tile['h']},
            'rotated': False,
            'trimmed': False,
            'spriteSourceSize': {'x': 0, 'y': 0, 'w': tile['w'], 'h': tile['h']},
            'sourceSize': {'w': tile['w'], 'h': tile['h']},
        }

    atlas.save(os.path.join(base_dir, ATLAS_PNG), format='PNG')
    meta = {
        'app': 'Cascade Atlas Builder',
        'version': 1,
        'image': ATLAS_PNG,
        'size': {'w': total_width, 'h': total_height},
        'scale': '1',
        'padding': PADDING,
        'grid': {'columns': COLUMNS, 'rows': ROWS},
    }
    data = {'frames': frames, 'meta': meta}
    with open(os.path.join(base_dir, ATLAS_JSON), 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    pairs = find_pairs(base_dir)
    if not pairs:
        print('No gaseous pairs found.')
        return

    output_files = []
    for idx, f0, f1 in pairs:
        out_name = OUTPUT_SINGLE_PATTERN.format(num=idx)
        out_path = os.path.join(base_dir, out_name)
        composite_pair(base_dir, f0, f1, out_path)
        output_files.append(out_name)
        print(f"Composited {f0} + {f1} -> {out_name}")

    build_atlas(base_dir, output_files)
    print(f"Wrote {ATLAS_PNG} and {ATLAS_JSON}")


if __name__ == '__main__':
    main()
