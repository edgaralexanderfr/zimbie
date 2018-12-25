# Author: Edgar Alexander Franco <edgaralexanderfr@gmail.com> (http://www.edgaralexanderfr.com.ve)
# Created: 08 20th 2018, 22:18
# Updated: 12 25th 2018, 16:42
# NOTE: In order to run this script you must install the Python's **Pillow** library via PIP, for
#       more information please read the *README.md* file of the project.

import os
import math
import bpy
import shutil

################################################################################################
# SETTINGS: ####################################################################################
path = '../../tmp/'
is_relative_path = True
total_frames = 4
resolution_x = 64
resolution_y = 64
angles_names = ['down', 'down-right', 'right', 'up-right', 'up', 'up-left', 'left', 'down-left']
angles_values = [0, 45, 90, 135, 180, 225, 270, 315]
cls_on_run = True
layer_count = 3
ignored_actions = []
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

try :
  shutil.rmtree(path)
except :
  pass

initial_action = armature.animation_data.action
action_count = len(bpy.data.actions)

# Iterate over each animation:
for a in range(0, action_count) :
  # We check if it's an ignored action, if so we jump to the next one:
  if (bpy.data.actions[a].name in ignored_actions) :
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
      if (ob.type == 'MESH' and ob.layers[l]) :
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

# TODO: Uncomment when all spritesheets are finished and done...
#try :
#  shutil.rmtree(path)
#except :
#  pass

print('All sprites exported correctly.')

# Reassign initial values:
armature.animation_data.action = initial_action
armature.rotation_euler.z = initial_armature_rotation_z
bpy.data.scenes['Scene'].render.filepath = initial_filepath
bpy.data.scenes['Scene'].frame_step = initial_frame_step
bpy.data.scenes['Scene'].render.resolution_y = initial_resolution_y
bpy.data.scenes['Scene'].render.resolution_x = initial_resolution_x
bpy.context.scene.camera = initial_camera
