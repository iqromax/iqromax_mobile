const { NodeIO } = require('@gltf-transform/core');
const { EXTTextureWebP } = require('@gltf-transform/extensions');
const sharp = require('sharp');

async function run() {
  const io = new NodeIO().registerExtensions([EXTTextureWebP]);
  console.log("Reading file...");
  const document = await io.read('/home/iam_masharipov/Desktop/iqromax_mobile/assets/models/ochki_9_optimized.glb');
  
  let changed = false;
  for (const texture of document.getRoot().listTextures()) {
    console.log("Texture format:", texture.getMimeType());
    if (texture.getMimeType() === 'image/webp') {
       console.log("Converting WebP to JPEG...");
       const imgData = texture.getImage();
       const jpegBuffer = await sharp(imgData).jpeg().toBuffer();
       texture.setImage(jpegBuffer);
       texture.setMimeType('image/jpeg');
       const name = texture.getName() || texture.getURI() || "texture";
       texture.setURI(name.replace('.webp', '.jpg'));
       changed = true;
    }
  }
  
  if (changed) {
    console.log("Writing back to file...");
    await io.write('/home/iam_masharipov/Desktop/iqromax_mobile/assets/models/ochki_9_optimized.glb', document);
    console.log("Done.");
  } else {
    console.log("No WebP textures found.");
  }
}
run().catch(console.error);
