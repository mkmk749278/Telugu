#!/usr/bin/env python3
"""Medigadda hero plates (PLAYBOOK §8): the Block 7 cross-section, the secant-pile wall and the 1.6 km plan, each as a
cut model on a site engineer's drafting table. Blender Cycles, headless (pip bpy).

  python3 scripts/blender/medigadda_hero.py --out projects/medigadda/assets/hero [--only h1_] [--w 2560 --h 1440 --samples 64]

Writes one PNG per plate (same camera inside a family, so Remotion can dissolve between states and move over them)
and anchors.json: named points of every family projected to the frame (0-1, top-left origin), for the overlays
(water paths, sand grains, labels) that Remotion draws on the word.

Scale: 1 unit = 5 m. Sourced (NDSA committee report, salient features): FRL 100 m, crest of the barrage bays 89 m
(11 m of water on the gates), river bed 88 m, 1,632 m long, 85 gates; the 1.256 m settlement is from news of the final report.
Everything else (raft thickness, pier shape, cutoff depth, rock depth) is NOT TO SCALE and labelled so on screen.
"""
import argparse, json, math, sys
from pathlib import Path
import bpy
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

ap = argparse.ArgumentParser()
ap.add_argument("--out", type=Path, required=True)
ap.add_argument("--only", default="")
ap.add_argument("--w", type=int, default=2560)
ap.add_argument("--h", type=int, default=1440)
ap.add_argument("--samples", type=int, default=64)
ap.add_argument("--threads", type=int, default=0)
a = ap.parse_args(sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else sys.argv[1:])
a.out.mkdir(parents=True, exist_ok=True)
D = bpy.data


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    s = bpy.context.scene
    s.render.engine = "CYCLES"
    s.cycles.device = "CPU"
    s.cycles.samples = a.samples
    s.cycles.use_denoising = True
    s.cycles.max_bounces = 8
    s.cycles.transparent_max_bounces = 12
    s.render.resolution_x, s.render.resolution_y = a.w, a.h
    s.render.image_settings.file_format = "PNG"
    s.view_settings.view_transform = "Filmic" if "Filmic" in [v.name for v in s.view_settings.bl_rna.properties["view_transform"].enum_items] else "AgX"
    try: s.view_settings.look = "AgX - Medium High Contrast"
    except Exception: pass
    if a.threads:
        s.render.threads_mode, s.render.threads = "FIXED", a.threads
    w = D.worlds.new("w"); s.world = w; w.use_nodes = True
    bg = w.node_tree.nodes["Background"]
    bg.inputs[0].default_value = (0.95, 0.72, 0.5, 1); bg.inputs[1].default_value = 0.2
    return s


def mat(name, col, rough=0.7, metal=0.0, alpha=1.0, trans=0.0, emit=0.0, noise=0.0, bump=0.0, nscale=30.0):
    m = D.materials.new(name); m.use_nodes = True
    nt = m.node_tree; b = nt.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*col, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    b.inputs["Alpha"].default_value = alpha
    b.inputs["Transmission Weight"].default_value = trans
    if emit:
        b.inputs["Emission Color"].default_value = (*col, 1); b.inputs["Emission Strength"].default_value = emit
    if noise or bump:
        tc = nt.nodes.new("ShaderNodeTexCoord"); n = nt.nodes.new("ShaderNodeTexNoise")
        n.inputs["Scale"].default_value = nscale; n.inputs["Detail"].default_value = 8
        nt.links.new(tc.outputs["Object"], n.inputs["Vector"])
        if noise:
            mix = nt.nodes.new("ShaderNodeMixRGB"); mix.blend_type = "MULTIPLY"; mix.inputs[0].default_value = noise
            mix.inputs[1].default_value = (*col, 1)
            nt.links.new(n.outputs["Color"], mix.inputs[2]); nt.links.new(mix.outputs[0], b.inputs["Base Color"])
        if bump:
            bp = nt.nodes.new("ShaderNodeBump"); bp.inputs["Strength"].default_value = bump
            nt.links.new(n.outputs["Fac"], bp.inputs["Height"]); nt.links.new(bp.outputs[0], b.inputs["Normal"])
    return m


def box(name, x0, x1, y0, y1, z0, z1, m, bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2))
    o = bpy.context.object; o.name = name; o.scale = (x1 - x0, y1 - y0, z1 - z0)
    bpy.ops.object.transform_apply(scale=True)
    if bevel:
        bm = o.modifiers.new("b", "BEVEL"); bm.width = bevel; bm.segments = 3
    o.data.materials.append(m)
    return o


def cyl(name, x, y, z0, z1, r, m, verts=32, rot=None):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=z1 - z0, location=(x, y, (z0 + z1) / 2))
    o = bpy.context.object; o.name = name; o.data.materials.append(m)
    if rot: o.rotation_euler = rot
    bpy.ops.object.shade_smooth() if verts > 8 else None
    return o


def cut(o, cutter):
    md = o.modifiers.new("cut", "BOOLEAN"); md.operation = "DIFFERENCE"; md.object = cutter; md.solver = "EXACT"
    cutter.hide_render = True; cutter.display_type = "WIRE"


def paper_tex(path):
    from PIL import Image, ImageDraw, ImageFilter
    import random
    random.seed(3)
    n = 4096
    im = Image.new("RGB", (n, n), (233, 219, 190))
    px = im.load()
    for _ in range(60000):
        x, y = random.randrange(n), random.randrange(n); v = random.randint(-9, 6)
        r, g, b = px[x, y]; px[x, y] = (r + v, g + v, b + v)
    im = im.filter(ImageFilter.GaussianBlur(1.2))
    d = ImageDraw.Draw(im)
    for i in range(0, n, 32):
        big = i % 320 == 0
        d.line([(i, 0), (i, n)], fill=(150, 165, 175) if big else (196, 198, 190), width=3 if big else 1)
        d.line([(0, i), (n, i)], fill=(150, 165, 175) if big else (196, 198, 190), width=3 if big else 1)
    im.save(path)


def table(s, size=240):
    tex = a.out / "_paper.png"
    if not tex.exists(): paper_tex(tex)
    bpy.ops.mesh.primitive_plane_add(size=size, location=(0, 0, 0))
    t = bpy.context.object; t.name = "table"
    m = D.materials.new("paper"); m.use_nodes = True; nt = m.node_tree; b = nt.nodes["Principled BSDF"]
    img = nt.nodes.new("ShaderNodeTexImage"); img.image = D.images.load(str(tex.resolve()))
    tc = nt.nodes.new("ShaderNodeTexCoord"); mp = nt.nodes.new("ShaderNodeMapping"); mp.inputs["Scale"].default_value = (size / 24, size / 24, 1)
    nt.links.new(tc.outputs["UV"], mp.inputs[0]); nt.links.new(mp.outputs[0], img.inputs[0]); nt.links.new(img.outputs[0], b.inputs["Base Color"])
    b.inputs["Roughness"].default_value = 0.85
    t.data.materials.append(m)
    return t


def pencil(name, x, y, z, length=5.0, r=0.16, col=(0.95, 0.68, 0.05), rot=(0, 0, 0)):
    """a hexagonal pencil along +Z from z: body, wood cone, graphite tip"""
    body = mat(name + "_b", col, 0.35); wood = mat(name + "_w", (0.85, 0.66, 0.42), 0.6); lead = mat(name + "_l", (0.05, 0.05, 0.06), 0.3)
    parts = [cyl(name, x, y, z + 0.5, z + length, r, body, verts=6)]
    bpy.ops.mesh.primitive_cone_add(vertices=6, radius1=0.0, radius2=r, depth=0.5, location=(x, y, z + 0.25))
    c = bpy.context.object; c.data.materials.append(wood); parts.append(c)
    bpy.ops.mesh.primitive_cone_add(vertices=6, radius1=0.0, radius2=r * 0.32, depth=0.16, location=(x, y, z + 0.08))
    t = bpy.context.object; t.data.materials.append(lead); parts.append(t)
    bpy.ops.object.select_all(action="DESELECT")
    for p in parts: p.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]; bpy.ops.object.join()
    o = bpy.context.object; o.name = name
    bpy.context.scene.cursor.location = (x, y, z); bpy.ops.object.origin_set(type="ORIGIN_CURSOR")
    o.rotation_euler = rot
    return o


def props(x0, x1, yf):
    """drafting things at the table edges: steel scale, two pencils lying, a rolled drawing"""
    steel = mat("steel", (0.62, 0.64, 0.66), 0.28, 1.0)
    box("scale", x0 - 0.5, x0 + 9.5, yf - 3.2, yf - 2.5, 0.0, 0.05, steel, 0.01)
    pencil("pl1", x1 - 6, yf - 2.6, 0.17, 5.5, rot=(0, math.radians(90), math.radians(8)))
    pencil("pl2", x1 - 5.2, yf - 3.4, 0.17, 5.5, col=(0.75, 0.12, 0.1), rot=(0, math.radians(90), math.radians(-14)))
    roll = mat("roll", (0.9, 0.87, 0.78), 0.8)
    cyl("roll", x1 + 2.5, 2.0, -5, 5, 0.7, roll, rot=(math.radians(90), 0, math.radians(12))).location.z = 0.7


def lights(target, key=900, warm=(1.0, 0.78, 0.55)):
    bpy.ops.object.light_add(type="AREA", location=(target[0] - 9, target[1] - 14, 16))
    k = bpy.context.object; k.data.energy = key * 2.2; k.data.size = 10; k.data.color = warm
    k.rotation_euler = (Vector(target) - k.location).to_track_quat("-Z", "Y").to_euler()
    bpy.ops.object.light_add(type="AREA", location=(target[0] + 14, target[1] - 8, 9))
    f = bpy.context.object; f.data.energy = key * 0.5; f.data.size = 14; f.data.color = (0.75, 0.85, 1.0)
    f.rotation_euler = (Vector(target) - f.location).to_track_quat("-Z", "Y").to_euler()
    bpy.ops.object.light_add(type="AREA", location=(target[0], target[1] + 12, 12))
    r = bpy.context.object; r.data.energy = key * 0.9; r.data.size = 8; r.data.color = (1.0, 0.85, 0.7)
    r.rotation_euler = (Vector(target) - r.location).to_track_quat("-Z", "Y").to_euler()


def camera(s, name, loc, target, lens=50):
    cd = D.cameras.new(name); c = D.objects.new(name, cd); s.collection.objects.link(c)
    c.location = loc; cd.lens = lens
    c.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    cd.dof.use_dof = False
    return c


ANCH = {}


def anchors(s, fam, cam, pts):
    bpy.context.view_layer.update()
    ANCH[fam] = {k: [round(v.x, 5), round(1 - v.y, 5)] for k, v in ((k, world_to_camera_view(s, cam, Vector(p))) for k, p in pts.items())}


def render(s, name, cam, show, allobjs):
    if a.only and not name.startswith(a.only): return
    if (a.out / name).exists(): return   # a stopped run resumes: plates already on disk are kept
    for o in allobjs: o.hide_render = o.name.split(".")[0] not in show and o.name not in show
    s.camera = cam; s.render.filepath = str((a.out / name).resolve())
    bpy.ops.render.render(write_still=True)
    print("plate", name, flush=True)


# ------------------------------------------------------------------ H1: the Block 7 cross-section
def h1():
    s = reset(); table(s)
    YF, YB = -3.0, 12.6            # the cut face (towards the camera) and the back
    BASE = 0.4                    # a plinth lifts the model off the paper
    RK, BED = BASE, BASE + 4.4    # rock top is at BASE+1.2; river bed at BED
    ROCK = BASE + 1.2
    X0, X1 = -13.0, 15.0
    sand = mat("sand", (0.72, 0.5, 0.22), 0.95, noise=0.75, bump=0.3, nscale=14)
    rock = mat("rock", (0.13, 0.13, 0.15), 0.8, noise=0.6, bump=0.6, nscale=9)
    conc = mat("conc", (0.42, 0.42, 0.41), 0.8, noise=0.4, bump=0.15, nscale=25)
    conc2 = mat("conc2", (0.52, 0.52, 0.5), 0.8, noise=0.35, bump=0.1, nscale=25)
    pile = mat("pile", (0.5, 0.5, 0.49), 0.85, noise=0.3, bump=0.2, nscale=30)
    gate = mat("gate", (0.2, 0.32, 0.42), 0.4, 0.8)
    road = mat("road", (0.16, 0.16, 0.17), 0.9)
    plinth = mat("plinth", (0.35, 0.24, 0.15), 0.5)
    water = mat("water", (0.22, 0.52, 0.92), 0.25, alpha=1.0, trans=0.7)
    void = mat("void", (0.005, 0.005, 0.008), 1.0)
    grout = mat("grout", (0.8, 0.8, 0.78), 0.7, noise=0.15, nscale=60)
    orange = mat("orange", (1.0, 0.33, 0.02), 0.6, emit=0.6)
    O = []
    def add(o): O.append(o); return o
    add(box("plinth", X0 - 0.3, X1 + 0.3, YF - 0.3, YB + 0.3, 0, BASE, plinth, 0.03))
    rk = add(box("rock", X0, X1, YF, YB, RK, ROCK, rock))
    sd = add(box("sand", X0, X1, YF, YB, ROCK, BED, sand))
    # raft and the works on it: raft x -4..4, top 0.25 above the bed, 0.9 thick
    RT, RB = BED + 0.25, BED - 0.65
    trench = box("trench", -4.0, 4.0, YF - 1, YB + 1, RB, BED + 1, sand); cut(sd, trench)
    raft = add(box("raft", -4.0, 4.0, YF - 0.012, YB, RB, RT, conc))
    piers = []
    PY = (-1.9, 1.9, 5.7, 9.5)
    def pier(name, y, m):
        parts = [box(name, -3.0, 3.0, y - 0.42, y + 0.42, RT, RT + 3.3, m), cyl(name + "a", -3.0, y, RT, RT + 3.3, 0.42, m), cyl(name + "b", 3.0, y, RT, RT + 3.3, 0.42, m)]
        bpy.ops.object.select_all(action="DESELECT")
        for q in parts: q.select_set(True)
        bpy.context.view_layer.objects.active = parts[0]; bpy.ops.object.join(); o = bpy.context.object; o.name = name; return o
    p0 = add(pier("pier0", PY[0], conc2)); piers.append(p0)
    rest = [pier(f"pr{i}", y, conc2) for i, y in enumerate(PY[1:])]
    bpy.ops.object.select_all(action="DESELECT")
    for q in rest: q.select_set(True)
    bpy.context.view_layer.objects.active = rest[0]; bpy.ops.object.join(); p1 = add(bpy.context.object); p1.name = "pier1"; piers.append(p1)
    half = add(box("pierhalf", -3.0, 3.0, YB - 0.42, YB, RT, RT + 3.3, conc2))  # the next pier, cut by the back face
    def gset(name, z0, first=True):
        gs = [box(name + str(i), -0.9, -0.7, PY[i] + 0.42, PY[i + 1] - 0.42, RT + z0, RT + z0 + 2.45, gate) for i in range(0 if first else 1, 3)]
        gs += [box(name + "e", -0.9, -0.7, PY[3] + 0.42, YB - 0.42, RT + z0, RT + z0 + 2.45, gate), box(name + "f", -0.9, -0.7, YF, PY[0] - 0.42, RT + z0, RT + z0 + 2.45, gate)]
        bpy.ops.object.select_all(action="DESELECT")
        for q in gs: q.select_set(True)
        bpy.context.view_layer.objects.active = gs[0]; bpy.ops.object.join(); o = bpy.context.object; o.name = name; return o
    gates = [add(gset("gate0", 0.0))]; g_rest = add(gset("gate1", 0.0, False)); g_rest.name = "gate1"; gates.append(g_rest)
    g2 = add(box("gate2", -0.9, -0.7, YF - 30, YF - 29, RT, RT + 0.1, gate)); gates.append(g2)
    gates_up = [add(gset("gateup0", 0.45))]
    deck = add(box("deck", 0.6, 3.2, YF, YB, RT + 3.3, RT + 3.55, road)); par = [add(box("parapet0", 0.6, 0.72, YF, YB, RT + 3.55, RT + 3.85, conc2)), add(box("parapet1", 3.08, 3.2, YF, YB, RT + 3.55, RT + 3.85, conc2))]
    hoist = add(box("hoist", -1.5, -0.2, YF, YB, RT + 3.3, RT + 3.5, conc2))
    # cutoffs: rows of secant piles along Y under the two ends of the raft
    def wall(name, x, zb):
        objs = []
        for j in range(36):
            objs.append(cyl(f"{name}_{j}", x, YF + 0.22 + j * 0.43, zb, RB, 0.27, pile, verts=24))
        objs.append(box(f"{name}_face", x - 0.24, x + 0.24, YF - 0.012, YF + 0.2, zb, RB, pile))
        bpy.ops.object.select_all(action="DESELECT")
        for o in objs: o.select_set(True)
        bpy.context.view_layer.objects.active = objs[0]; bpy.ops.object.join(); o = bpy.context.object; o.name = name
        return add(o)
    ZS = BED - 2.2
    us_s, ds_s = wall("us_short", -3.7, ZS), wall("ds_short", 3.7, ZS)
    us_r, ds_r = wall("us_rock", -3.7, ROCK - 0.15), wall("ds_rock", 3.7, ROCK - 0.15)
    dwall = [add(box("dwall_us", -4.75, -4.3, YF - 0.012, YB, ROCK - 0.15, BED + 0.1, grout)), add(box("dwall_ds", 4.3, 4.75, YF - 0.012, YB, ROCK - 0.15, BED + 0.1, grout))]
    # aprons: concrete floor then loose CC blocks, both sides
    apron = add(box("apron_ds", 4.0, 7.0, YF - 0.012, YB, BED - 0.25, BED + 0.1, conc)); add(box("apron_us", -6.0, -4.0, YF - 0.012, YB, BED - 0.25, BED + 0.1, conc))
    apron_ext = add(box("apron_ext", 7.0, 12.0, YF - 0.012, YB, BED - 0.3, BED + 0.1, grout))
    blocks = []
    for ix in range(9):
        for iy in range(23):
            blocks.append(box(f"ccb_{ix}_{iy}", 7.05 + ix * 0.56, 7.05 + ix * 0.56 + 0.5, YF + 0.05 + iy * 0.66, YF + 0.05 + iy * 0.66 + 0.6, BED - 0.12, BED + 0.16, conc2, 0.03))
    bpy.ops.object.select_all(action="DESELECT")
    for o in blocks: o.select_set(True)
    bpy.context.view_layer.objects.active = blocks[0]; bpy.ops.object.join(); ccb = add(bpy.context.object); ccb.name = "ccblocks"
    scour = box("scourcut", 7.0, 12.4, YF - 1, YB + 1, BED - 0.9, BED + 1, sand)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=(9.5, 0, BED + 0.25)); sc = bpy.context.object; sc.scale = (2.9, 30, 1.0); sc.name = "scour"
    # water: the pond upstream of the gates, the low river downstream
    POND, TAIL = BED + 2.2, BED + 0.55          # 11 m of head = 2.2 units
    w_up = add(box("water_up", X0 + 0.02, -0.9, YF + 0.02, YB - 0.02, BED + 0.02, POND, water))
    w_dn = add(box("water_dn", -0.7, X1 - 0.02, YF + 0.02, YB - 0.02, BED + 0.02, TAIL, water))
    w_low = add(box("water_low", X0 + 0.02, X1 - 0.02, YF + 0.02, YB - 0.02, BED + 0.02, TAIL, water))
    for w in (w_up, w_dn, w_low):
        for q in (piers + [half, raft, apron] + gates):
            pass
    # the void under the raft, near the downstream cutoff: carved out of the sand
    def blob(name, x, z, rx, rz):
        bpy.ops.mesh.primitive_uv_sphere_add(radius=1, segments=48, ring_count=24, location=(x, YF, z)); o = bpy.context.object
        o.scale = (rx, 7.0, rz); o.name = name; return o
    v1c, v2c = blob("v1c", 2.4, RB - 0.05, 0.9, 0.3), blob("v2c", 1.7, RB - 0.1, 2.1, 0.62)
    for c in (v1c, v2c): c.hide_render = True
    sand_v1 = add(sd.copy()); sand_v1.data = sd.data.copy(); sand_v1.name = "sand_v1"; s.collection.objects.link(sand_v1); cut(sand_v1, v1c)
    sand_v2 = add(sd.copy()); sand_v2.data = sd.data.copy(); sand_v2.name = "sand_v2"; s.collection.objects.link(sand_v2); cut(sand_v2, v2c)
    sand_sc = add(sd.copy()); sand_sc.data = sd.data.copy(); sand_sc.name = "sand_sc"; s.collection.objects.link(sand_sc); cut(sand_sc, v2c)
    m2 = sand_sc.modifiers.new("sc", "BOOLEAN"); m2.operation = "DIFFERENCE"; m2.object = sc; m2.solver = "EXACT"; sc.hide_render = True
    sand_v1sc = add(sd.copy()); sand_v1sc.data = sd.data.copy(); sand_v1sc.name = "sand_v1sc"; s.collection.objects.link(sand_v1sc); cut(sand_v1sc, v1c)
    m3 = sand_v1sc.modifiers.new("sc", "BOOLEAN"); m3.operation = "DIFFERENCE"; m3.object = sc; m3.solver = "EXACT"
    sand_0sc = add(sd.copy()); sand_0sc.data = sd.data.copy(); sand_0sc.name = "sand_0sc"; s.collection.objects.link(sand_0sc)
    m4 = sand_0sc.modifiers.new("sc", "BOOLEAN"); m4.operation = "DIFFERENCE"; m4.object = sc; m4.solver = "EXACT"
    scour.hide_render = True
    # dark lining so the void reads black, and the grout that later fills it
    vd = add(box("voiddark", -1.0, 3.4, YF + 0.03, YB, RB - 0.8, RB - 0.001, void))
    gr = blob("grout", 1.7, RB - 0.1, 2.05, 0.6); gr.data.materials.append(grout); add(gr)
    grc = box("groutclip", -3, 6, YF - 4, YF, RB - 2, RB + 1, grout); cut(gr, grc)
    grc2 = box("groutclip2", -3, 6, YF - 4, YB, RB, RB + 2, grout); m5 = gr.modifiers.new("c2", "BOOLEAN"); m5.operation = "DIFFERENCE"; m5.object = grc2; m5.solver = "EXACT"; grc2.hide_render = True
    # the settled state: raft, the front pier (pier 20) and its deck drop 1.256 m = 0.25 units and tilt downstream
    def settled(objs, tag, m=None):
        res = []
        for o in objs:
            c = o.copy(); c.data = o.data.copy(); c.name = o.name + tag; s.collection.objects.link(c)
            if m: c.data.materials.clear(); c.data.materials.append(m)
            res.append(add(c))
        return res
    piv = Vector((-4.0, 0, RB))
    def drop(objs, ang=math.radians(1.8), dz=-0.06):
        import mathutils
        R = mathutils.Matrix.Translation(piv) @ mathutils.Matrix.Rotation(ang, 4, "Y") @ mathutils.Matrix.Translation(-piv)
        for o in objs: o.matrix_world = mathutils.Matrix.Translation((0, 0, dz)) @ R @ o.matrix_world
    st = settled([raft, piers[1], half, deck, hoist] + par + gates_up, "_st"); st_p = settled([piers[0]], "_st", orange)
    drop(st + st_p)
    props(X0, X1, YF)
    lights((0, 3, BED), key=1500)
    front = camera(s, "front", (-9.0, -40, 20.0), (1.0, 1.0, BED + 0.2), 56)
    under = camera(s, "under", (4.5, -17, BED + 2.2), (1.6, 0, RB - 0.6), 55)
    wide = camera(s, "wide", (-24, -36, 28), (0.5, 3, BED), 44)
    thumb = camera(s, "thumb", (14, -27, 16), (1.2, 1.5, BED + 0.4), 48)
    P = dict(rock_top=(0, YF, ROCK), bed_up=(-9, YF, BED), bed_dn=(10, YF, BED), raft_tl=(-4, YF, RT), raft_tr=(4, YF, RT), raft_bl=(-4, YF, RB), raft_br=(4, YF, RB),
             us_top=(-3.7, YF, RB), us_short=(-3.7, YF, ZS), us_rock=(-3.7, YF, ROCK), ds_top=(3.7, YF, RB), ds_short=(3.7, YF, ZS), ds_rock=(3.7, YF, ROCK),
             pond=(-9, YF, POND), pond_gate=(-0.9, YF, POND), tail=(10, YF, TAIL), tail_gate=(-0.7, YF, TAIL), gate_bot=(-0.8, YF, RT), gate_top=(-0.8, YF, RT + 2.45),
             pier_top=(0, -1.9, RT + 3.3), pier_mid=(0, -1.9 - 0.42, RT + 1.6), deck=(1.9, YF, RT + 3.55), void=(1.7, YF, RB - 0.3), void_l=(-0.4, YF, RB - 0.1), void_r=(3.4, YF, RB - 0.1),
             apron_end=(7, YF, BED + 0.1), blocks_end=(12, YF, BED + 0.16), ext_end=(12, YF, BED + 0.1), sand_mid=(-8, YF, (ROCK + BED) / 2), rock_mid=(-8, YF, (RK + ROCK) / 2),
             in_up=(-7.5, YF, BED), out_dn=(6.0, YF, BED), under_mid=(0, YF, RB - 1.2), deep_mid=(0, YF, ROCK + 0.4), left=(X0, YF, BED), right=(X1, YF, BED), base_l=(X0, YF, BASE), base_r=(X1, YF, BASE),
             unit=(1, YF, BED), origin=(0, YF, BED), scour=(9.5, YF, BED - 0.5),
             deck_near=(1.9, YF, RT + 3.7), deck_far=(1.9, YB, RT + 3.7), gate_far=(-0.8, YB, RT + 2.45), pier_face=(0, -1.9 - 0.42, RT + 2.6), pier_far=(0, 9.5, RT + 3.3),
             pond_far=(-9, YB, POND), tail_far=(10, YB, TAIL), raft_mid=(0, YF, (RB + RT) / 2), blocks_mid=(9.5, 0, BED + 0.2), gate_mid=(-0.8, 0, RT + 1.2), pump=(-11, YB, POND))
    for cam in (front, under, wide, thumb): anchors(s, "h1_" + cam.name, cam, P)
    A = ["table", "plinth", "rock", "scale", "pl1", "pl2", "roll"]
    built = A + ["raft", "pier0", "pier1", "pierhalf", "deck", "parapet0", "parapet1", "hoist", "apron_ds", "apron_us"]
    gd = ["gate0", "gate1"]; wt = ["water_up", "water_dn"]
    states = {
        "bare": A + ["sand"],
        "raft": A + ["sand", "raft"],
        "piers": A + ["sand", "raft", "pier0", "pier1", "pierhalf"],
        "gates": A + ["sand", "raft", "pier0", "pier1", "pierhalf", "gate0", "gate1", "hoist"],
        "road": built + gd + ["sand", "ccblocks"],
        "water": built + gd + wt + ["sand", "ccblocks"],
        "open": built + ["gateup0", "water_low", "sand", "ccblocks"],
        "short": built + gd + wt + ["sand", "ccblocks", "us_short", "ds_short"],
        "rockwall": built + gd + wt + ["sand", "ccblocks", "us_rock", "ds_rock"],
        "noblocks": built + gd + wt + ["sand_0sc", "us_rock", "ds_rock"],
        "void1": built + gd + wt + ["sand_v1sc", "voiddark", "us_rock", "ds_rock"],
        "void2": built + gd + wt + ["sand_sc", "voiddark", "us_rock", "ds_rock"],
        "settled": A + ["sand_sc", "voiddark", "us_rock", "ds_rock", "apron_ds", "apron_us", "water_low"] + [o.name for o in st + st_p],
        "grouted": A + ["sand_sc", "voiddark", "grout", "us_rock", "ds_rock", "apron_ds", "apron_us", "water_low"] + [o.name for o in st + st_p],
        "repaired": built + ["gateup0", "water_low", "sand", "grout", "us_rock", "ds_rock", "dwall_us", "dwall_ds", "apron_ext"],
    }
    allo = [o for o in s.collection.all_objects if o.type == "MESH"]
    for o in allo: o.hide_render = True
    for cam, names in ((front, list(states)), (under, ["rockwall", "void1", "void2", "settled", "grouted", "short"]), (wide, ["road", "water", "settled"]), (thumb, ["void2", "settled"])):
        for n in names: render(s, f"h1_{cam.name}_{n}.png", cam, set(states[n]), allo)


# ------------------------------------------------------------------ H2: pencils and the secant-pile wall
def h2():
    s = reset(); table(s)
    conc = mat("pile", (0.55, 0.55, 0.53), 0.85, noise=0.3, bump=0.25, nscale=30); conc_b = mat("pileb", (0.68, 0.67, 0.64), 0.85, noise=0.3, bump=0.25, nscale=30)
    sand = mat("sand", (0.78, 0.6, 0.32), 0.95, noise=0.5, bump=0.25, nscale=55); grout = mat("grout", (0.8, 0.8, 0.78), 0.7, noise=0.15, nscale=60)
    plinth = mat("plinth", (0.35, 0.24, 0.15), 0.5)
    N = 13; O = []
    def add(o): O.append(o); return o
    add(box("plinth", -5.2, 5.2, -1.2, 1.2, 0, 0.3, plinth, 0.03))
    add(box("soil", -5, 5, 0.25, 1.0, 0.3, 4.2, sand))
    for i in range(N):
        x = -3.9 + i * 0.65
        add(cyl(f"pileA{i}", x, -0.1, 0.3, 4.6, 0.42, conc_b if i % 2 else conc, verts=40))
        if i != 6: add(cyl(f"pileG{i}", x if i < 6 else x + 0.0, -0.1, 0.3, 4.6, 0.42 if i not in (5, 7) else 0.42, conc_b if i % 2 else conc, verts=40))
    # the gap state: pile 6 missing its overlap (drifted and thin), leaving a slit
    add(cyl("pileG6", -3.9 + 6 * 0.65 + 0.02, -0.1, 0.3, 4.6, 0.2, conc, verts=40))
    add(box("dwall", -4.3, 4.3, -0.5, 0.3, 0.3, 4.6, grout, 0.02))
    cols = [(0.95, 0.68, 0.05), (0.9, 0.62, 0.05)]
    for i in range(N):
        x = -3.9 + i * 0.65 + 13
        add(pencil(f"penA{i}", x, -0.1, 0.02, 4.8, 0.36, cols[i % 2]))
        if i != 6: add(pencil(f"penG{i}", x, -0.1, 0.02, 4.8, 0.36, cols[i % 2]))
    add(pencil("penG6", -3.9 + 6 * 0.65 + 13 + 0.16, -0.25, 0.02, 4.8, 0.36, cols[0], rot=(math.radians(-4), math.radians(7), 0)))
    add(box("tray", 13 - 4.6, 13 + 4.6, -0.7, 0.5, 0, 0.06, plinth, 0.02))
    props(-8, 22, 3.5)
    lights((0, 0, 2.2), key=700); lights((13, 0, 2.2), key=700)
    # a light behind each row so a gap shows as light
    for cx in (0.02, 13.16):
        bpy.ops.object.light_add(type="AREA", location=(cx, 3.2, 2.4)); l = bpy.context.object; l.data.energy = 2600; l.data.size = 1.2; l.data.color = (0.55, 0.8, 1.0)
        l.rotation_euler = (math.radians(90), 0, 0)
    c1 = camera(s, "piles", (0.8, -15, 4.6), (0, 0, 2.3), 55); c2 = camera(s, "pencils", (13.8, -15, 4.6), (13, 0, 2.3), 55)
    anchors(s, "h2_piles", c1, dict(gap=(0.02, -0.5, 2.4), top=(0, -0.1, 4.6), left=(-3.9, -0.5, 2.4), right=(3.9, -0.5, 2.4), base=(0, -0.5, 0.3), **{f"p{i}": (-3.9 + i * 0.65, -0.52, 4.6) for i in range(N)}))
    anchors(s, "h2_pencils", c2, dict(gap=(13.1, -0.5, 2.4), top=(13, -0.1, 4.8), left=(9.1, -0.5, 2.4), right=(16.9, -0.5, 2.4), **{f"p{i}": (-3.9 + i * 0.65 + 13, -0.46, 4.8) for i in range(N)}))
    allo = [o for o in s.collection.all_objects if o.type == "MESH"]
    A = {"table", "plinth", "scale", "pl1", "pl2", "roll", "tray"}
    PA = {f"pileA{i}" for i in range(N)}; PG = {f"pileG{i}" for i in range(N)}; NA = {f"penA{i}" for i in range(N)}; NG = {f"penG{i}" for i in range(N)}
    render(s, "h2_piles_sound.png", c1, A | PA | NA, allo); render(s, "h2_piles_gap.png", c1, A | PG | NG, allo)
    render(s, "h2_piles_dwall.png", c1, A | {"dwall"} | NA, allo)
    render(s, "h2_pencils_sound.png", c2, A | PA | NA, allo); render(s, "h2_pencils_gap.png", c2, A | PG | NG, allo)
    for k in range(1, N + 1, 3):   # the row being built, pile by pile
        render(s, f"h2_piles_build{k:02d}.png", c1, A | {f"pileA{i}" for i in range(k)} | NA, allo)


# ------------------------------------------------------------------ H3: the 1.6 km plan and the borehole pins
def h3():
    s = reset(); table(s, 240)
    conc = mat("conc", (0.66, 0.66, 0.64), 0.8, noise=0.2, nscale=40); gate = mat("gate", (0.2, 0.32, 0.42), 0.4, 0.8); road = mat("road", (0.16, 0.16, 0.17), 0.9)
    water = mat("water", (0.25, 0.55, 0.85), 0.08, trans=0.8); sand = mat("sand", (0.78, 0.6, 0.32), 0.95, noise=0.5, nscale=55)
    pinr = mat("pinr", (0.9, 0.08, 0.05), 0.3); pinn = mat("pinn", (0.8, 0.8, 0.82), 0.25, 1.0); plinth = mat("plinth", (0.35, 0.24, 0.15), 0.5)
    L = 32.64   # 1,632 m at 1 unit = 50 m
    O = []
    def add(o): O.append(o); return o
    add(box("plinth", -L / 2 - 0.6, L / 2 + 0.6, -3.3, 3.3, 0, 0.25, plinth, 0.03))
    add(box("bed", -L / 2 - 0.4, L / 2 + 0.4, -3.1, 3.1, 0.25, 0.5, sand))
    add(box("water", -L / 2 - 0.38, L / 2 + 0.38, 0.2, 3.08, 0.5, 0.72, water)); add(box("waterlow", -L / 2 - 0.38, L / 2 + 0.38, -3.08, -0.2, 0.5, 0.56, water))
    add(box("raft", -L / 2, L / 2, -0.45, 0.45, 0.45, 0.6, conc))
    bay = L / 85
    for i in range(86):
        x = -L / 2 + i * bay
        add(box(f"pier{i}", x - 0.06, x + 0.06, -0.4, 0.4, 0.6, 1.25, conc))
    add(box("gates", -L / 2, L / 2, 0.08, 0.13, 0.6, 1.1, gate)); add(box("road", -L / 2 - 0.3, L / 2 + 0.3, -0.36, -0.1, 1.25, 1.33, road))
    kept = [7, 21, 35, 49, 63, 77]   # six of the 85, spread for the picture: positions are illustrative
    pts = {}
    for i in range(85):
        x = -L / 2 + (i + 0.5) * bay
        pts[f"b{i}"] = (x, -1.6, 0.56)
        nm = "pinK" if i in kept else "pinX"
        add(cyl(f"{nm}n{i}", x, -1.6, 0.5, 1.7, 0.035, pinn, verts=8))
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.17, location=(x, -1.6, 1.8)); h = bpy.context.object; h.name = f"{nm}h{i}"; h.data.materials.append(pinr); bpy.ops.object.shade_smooth(); add(h)
    props(-L / 2, L / 2, -3.5)
    lights((0, 0, 0.6), key=1500)
    full = camera(s, "plan", (0, -15, 31), (0, -0.4, 0.6), 34)
    run_a = camera(s, "runa", (-L / 2 + 2.0, -10, 7.5), (-L / 2 + 6.5, -1.0, 0.8), 34); run_b = camera(s, "runb", (L / 2 - 2.0, -10, 7.5), (L / 2 - 6.5, -1.0, 0.8), 34)
    pts.update(left=(-L / 2, -0.45, 0.6), right=(L / 2, -0.45, 0.6), mid=(0, 0, 1.33))
    for c in (full, run_a, run_b): anchors(s, "h3_" + c.name, c, pts)
    allo = [o for o in s.collection.all_objects if o.type == "MESH"]
    A = {o.name for o in allo if not o.name.startswith("pin")}
    K = {o.name for o in allo if o.name.startswith("pinK")}; X = {o.name for o in allo if o.name.startswith("pinX")}
    for c in (full, run_a, run_b):
        render(s, f"h3_{c.name}_none.png", c, A, allo); render(s, f"h3_{c.name}_85.png", c, A | K | X, allo); render(s, f"h3_{c.name}_6.png", c, A | K, allo)


for fn in (h1, h2, h3):
    if not a.only or a.only.startswith(fn.__name__):
        fn()
old = {}
aj = a.out / "anchors.json"
if aj.exists(): old = json.loads(aj.read_text())
old.update(ANCH); aj.write_text(json.dumps(old, indent=0))
print("done", sorted(ANCH))
