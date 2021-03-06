# Author: Edgar Alexander Franco <edgaralexanderfr@gmail.com> (http://www.edgaralexanderfr.com.ve)
# Created: 08 20th 2018, 22:18
# Updated: 01 05th 2019, 18:05
# NOTE: In order to run this script you must install the Python's **Pillow** library via PIP, for
#       more information please read the *README.md* file of the project. Make sure gulp's task
#       **browser-sync** is not running before you execute this script.

import os
import math
import bpy
import shutil
from PIL import Image

################################################################################################
# SETTINGS: ####################################################################################
path = '../../tmp/'
is_relative_path = True
output_path = '../../../../../app/assets/sprites/character/'
output_extension = '.png'
total_frames = 4
resolution_x = 64
resolution_y = 64
angles_names = ['down', 'down-right', 'right', 'up-right', 'up', 'up-left', 'left', 'down-left']
angles_values = [0, 45, 90, 135, 180, 225, 270, 315]
cls_on_run = True
layer_count = 3
pixelation = 0.5
actions = []
meshes = []
merge = {
  "body": ["body", "head"]
}
################################################################################################

# Save current scene state:
initial_camera = bpy.context.scene.camera
initial_resolution_x = bpy.data.scenes['Scene'].render.resolution_x
initial_resolution_y = bpy.data.scenes['Scene'].render.resolution_y
initial_frame_step = bpy.data.scenes['Scene'].frame_step
initial_filepath = bpy.data.scenes['Scene'].render.filepath

# Clear screen if neccessary:
if (cls_on_run) :
  os.system('cls')

if total_frames > 0 :
  bpy.data.scenes['Scene'].frame_step = math.ceil(bpy.data.scenes['Scene'].frame_end / total_frames)

# Assign the armature object:
armature = None

for ob in bpy.data.objects :
  if (ob.type == 'ARMATURE' and ob.name == 'Armature') :
    armature = ob
    break

initial_armature_rotation_z = armature.rotation_euler.z

bpy.data.scenes['Scene'].render.resolution_x = resolution_x
bpy.data.scenes['Scene'].render.resolution_y = resolution_y

# Delete project's tmp folder used for the script:
try :
  shutil.rmtree(path)
except :
  pass

initial_action = armature.animation_data.action
action_count = len(bpy.data.actions)

# Iterate over each animation:
for a in range(0, action_count) :
  # We check if it's an ignored action, if so we jump to the next one:
  if (len(actions) > 0 and bpy.data.actions[a].name not in actions) :
    continue

  armature.animation_data.action = bpy.data.actions[a]

  # Hide every layer:
  for l in range(0, layer_count) :
    bpy.data.scenes['Scene'].render.layers['RenderLayer'].layers[l] = False

  # Iterate over each mesh from each layer:
  for l in range(0, layer_count) :
    bpy.data.scenes['Scene'].render.layers['RenderLayer'].layers[l] = True

    # We hide the previous layer after showing the current one, if we're at
    # the first layer then we proceed to hide the last one:
    if (l == 0) :
      bpy.data.scenes['Scene'].render.layers['RenderLayer'].layers[layer_count - 1] = False
    else :
      bpy.data.scenes['Scene'].render.layers['RenderLayer'].layers[l - 1] = False

    # Hide every object within current layer:
    for ob in bpy.data.objects :
      if (ob.type == 'MESH' and ob.layers[l]) :
        ob.hide_render = True

    # Iterate over each object within current layer independently:
    for ob in bpy.data.objects :
      if (ob.type == 'MESH' and ob.layers[l] and (len(meshes) < 1 or ob.name in meshes)) :
        ob.hide_render = False

        for i, angle in enumerate(angles_values) :
          armature.rotation_euler = (0, 0, (angle * math.pi) / 180)
          export_path = ''

          if (is_relative_path) :
            export_path += '//'

          export_path += path + 'character/' + ob.name.lower() + '/' + armature.animation_data.action.name.lower() + '/' + angles_names[i] + '/'
          bpy.data.scenes['Scene'].render.filepath = export_path

          try :
            os.makedirs(bpy.data.scenes['Scene'].render.filepath)
          except OSError :
            pass

          print(bpy.data.scenes['Scene'].render.filepath)
          bpy.ops.render.render(animation=True)

        ob.hide_render = True

    # Show every object within current layer again:
    for ob in bpy.data.objects :
      if (ob.type == 'MESH' and ob.layers[l]) :
        ob.hide_render = False

  # Show every layer again:
  for l in range(0, layer_count) :
    bpy.data.scenes['Scene'].render.layers['RenderLayer'].layers[l] = True

# Generate every spritesheet:

total_actions_to_export = len(actions)

if (total_actions_to_export < 1) :
  total_actions_to_export = action_count

sheet_width = resolution_x * total_frames
sheet_height = resolution_y * len(angles_names) * total_actions_to_export
pixelation_scale = 1.0 - pixelation

print('Generating spritesheets...')

for ob in bpy.data.objects :
  if (ob.type != 'MESH' or (len(meshes) > 0 and ob.name not in meshes)) :
    continue

  sheet = Image.new('RGBA', (sheet_width, sheet_height), color = (255, 255, 255, 0))
  y = 0

  for a in range(0, action_count) :
    # We check if it's an ignored action, if so we jump to the next one:
    if (len(actions) > 0 and bpy.data.actions[a].name not in actions) :
      continue

    for angle_name in angles_names :
      images_path = path + 'character/' + ob.name.lower() + '/' + bpy.data.actions[a].name.lower() + '/' + angle_name + '/'
      images_files = os.listdir(images_path)
      x = 0

      for image_file in images_files :
        image = Image.open(images_path + image_file)
        sheet.paste(image, (x, y))
        image.close()
        x += resolution_x

      y += resolution_y

  if (pixelation > 0.0) :
    sheet_size = sheet.size
    old_sheet = sheet
    sheet = old_sheet.resize((round(sheet_width * pixelation_scale), round(sheet_height * pixelation_scale)), resample=Image.BILINEAR)
    old_sheet.close()
    old_sheet = sheet
    sheet = old_sheet.resize(sheet_size, Image.NEAREST)
    old_sheet.close()

  sheet.save(output_path + ob.name.lower() + output_extension)
  sheet.close()

# Merge configured spritesheets:

print('Merging spritesheets...')

# Preload all spritesheets to merge:
spritesheets = {}

for merge_name in merge :
  for spritesheet_to_merge in merge[merge_name] :
    if (spritesheet_to_merge not in spritesheets) :
      spritesheets[spritesheet_to_merge] = Image.open(output_path + spritesheet_to_merge + output_extension)

# Merge every listed spritesheet:
for merge_name in merge :
  merged_spritesheet = Image.new('RGBA', (sheet_width, sheet_height), color = (255, 255, 255, 0))

  for spritesheet_to_merge in merge[merge_name] :
    old_merged_spritesheet = merged_spritesheet
    merged_spritesheet = Image.alpha_composite(merged_spritesheet, spritesheets[spritesheet_to_merge])
    old_merged_spritesheet.close()

  merged_spritesheet.save(output_path + merge_name + output_extension)
  merged_spritesheet.close()

# Close all pointers and delete files used for merging except the
# results that use the same name:
for spritesheet_to_merge in spritesheets :
  spritesheets[spritesheet_to_merge].close()

  if (spritesheet_to_merge not in merge) :
    os.remove(output_path + spritesheet_to_merge + output_extension)

# Delete project's tmp folder used for the script:
try :
  shutil.rmtree(path)
except :
  pass

print('All sprites exported correctly.')

# Reassign initial values:
armature.animation_data.action = initial_action
armature.rotation_euler.z = initial_armature_rotation_z
bpy.data.scenes['Scene'].render.filepath = initial_filepath
bpy.data.scenes['Scene'].frame_step = initial_frame_step
bpy.data.scenes['Scene'].render.resolution_y = initial_resolution_y
bpy.data.scenes['Scene'].render.resolution_x = initial_resolution_x
bpy.context.scene.camera = initial_camera
