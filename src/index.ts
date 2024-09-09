
import { Hono } from 'hono';
import { statSync, readFileSync } from 'fs';
import { poweredBy } from 'hono/powered-by';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from './utils/constants';
import path from 'path';
import { pictureService } from './services/picture.service';

const app = new Hono();

app.use('*', poweredBy());

app.post("/upload", async (c) => {
  try {
    const formData = await c.req.parseBody();

    const file = formData["image"];
    if (!file || !(file instanceof File)) {
      throw new Error("Invalid file");
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File too large. Max file size is 5MB");
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error("Invalid file type");
    }

    const data = await pictureService.writePicture(file);

    return c.json(data)
  } catch (err) {
    if (err instanceof Error) {
      return c.json({ error: err.message }, 400);
    }

    return c.json({ error: 'Something went wrong' }, 500);
  }
})

app.get('/uploads/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const thumb = c.req.query('thumb');

    if (!id) {
      throw new Error("Invalid fileId");
    }

    if (thumb) {
      const picture = await pictureService.getPicture(id, true);

      return c.json(picture)
    }

    const picture = await pictureService.getPicture(id);

    return new Response(picture, {
      headers: {
        'Content-Type': 'image/webp'
      }
    })

  } catch (e) {
    if (e instanceof Error) {
      return c.json({ error: e.message }, 400);
    }

    return c.json({ error: 'Something went wrong' }, 500);
  }
});


export default {
  port: 5000,
  fetch: app.fetch,
};

