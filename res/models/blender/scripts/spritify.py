import os
import math
import bpy
import shutil

################################################################################################
# SETTINGS: ####################################################################################
path = '//../../tmp/'
total_frames = 4
resolution_x = 64
resolution_y = 64
angles_names = ['down', 'down-right', 'right', 'up-right', 'up', 'up-left', 'left', 'down-left']
angles_values = [0, 45, 90, 135, 180, 225, 270, 315]
################################################################################################

initial_camera = bpy.context.scene.camera
initial_resolution_x = bpy.data.scenes['Scene'].render.resolution_x
initial_resolution_y = bpy.data.scenes['Scene'].render.resolution_y
initial_frame_step = bpy.data.scenes['Scene'].frame_step
initial_filepath = bpy.data.scenes['Scene'].render.filepath

if total_frames > 0 :
  bpy.data.scenes['Scene'].frame_step = math.ceil(bpy.data.scenes['Scene'].frame_end / total_frames)

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

for i, angle in enumerate(angles_values) :
  armature.rotation_euler = (0, 0, (angle * math.pi) / 180)
  bpy.data.scenes['Scene'].render.filepath = path + angles_names[i] + '/'

  try :
    os.makedirs(bpy.data.scenes['Scene'].render.filepath)
  except OSError :
    pass

  print(bpy.data.scenes['Scene'].render.filepath)
  bpy.ops.render.render(animation=True)

print('All sprites exported correctly.')

# Reassign initial values:
armature.rotation_euler.z = initial_armature_rotation_z
bpy.data.scenes['Scene'].render.filepath = initial_filepath
bpy.data.scenes['Scene'].frame_step = initial_frame_step
bpy.data.scenes['Scene'].render.resolution_y = initial_resolution_y
bpy.data.scenes['Scene'].render.resolution_x = initial_resolution_x
bpy.context.scene.camera = initial_camera
