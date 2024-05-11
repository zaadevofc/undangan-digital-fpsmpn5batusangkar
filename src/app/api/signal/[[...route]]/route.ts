import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import prisma from '~/prisma';
import keygen from 'keygen';

const app = new Hono().basePath('/api/signal')
const baseUrl = (c: any) => c.req.raw.nextUrl.origin + '/';

app.get('/list', async (c) => {
  const data = (await prisma.undangan.findMany()).reverse()
  return c.json({ ok: true, data })
})

app.get('/access', async (c) => {
  const data = (await prisma.user.findMany()).reverse()
  return c.json({ ok: true, data })
})

app.post('/access/delete', async (c) => {
  let { id } = await c.req.json()
  if (!id) return c.json({ ok: false, message: 'Parameter [id] tidak boleh kosong!' })
  const data = await prisma.user.delete({ where: { id } })
  return c.json({ ok: true, data })
})

app.post('/access/update', async (c) => {
  let { id, role } = await c.req.json()
  if (!id || !role) return c.json({ ok: false, message: 'Parameter [id, role] tidak boleh kosong!' })
  const data = await prisma.user.update({
    where: { id },
    data: { role }
  })
  return c.json({ ok: true, data })
})

app.get('/find', async (c) => {
  let { id } = c.req.query()
  if (!id) return c.json({ ok: false, message: 'Parameter [id] tidak boleh kosong!' })

  const data = await prisma.undangan.findUnique({
    where: { invitation_id: id }
  })
  return c.json({ ok: true, data })
})

app.post('/delete', async (c) => {
  let { id } = await c.req.json()
  if (!id) return c.json({ ok: false, message: 'Parameter [id] tidak boleh kosong!' })

  const data = await prisma.undangan.delete({
    where: { invitation_id: id }
  })
  return c.json({ ok: true, data })
})

app.post('/update', async (c) => {
  let { id, peserta } = await c.req.json()
  if (!id || !peserta) return c.json({ ok: false, message: 'Parameter [id, peserta] tidak boleh kosong!' })

  const update = await prisma.undangan.update({
    where: { invitation_id: id },
    data: { invitation_person: peserta }
  })
  return c.json({ ok: true, data: { ...update, uri: baseUrl(c) + update.invitation_id } })
})

app.post('/create', async (c) => {
  let { peserta } = await c.req.json()
  if (!peserta) return c.json({ ok: false, message: 'Parameter [peserta] tidak boleh kosong!' })

  const create = await prisma.undangan.create({
    data: {
      invitation_id: keygen.url(6),
      invitation_agenda: 'Acara Perpisahan - SMPN 5 Batusangkar',
      invitation_person: peserta
    }
  })
  return c.json({ ok: true, data: { ...create, uri: baseUrl(c) + create.invitation_id } })
})

export const GET = handle(app)
export const POST = handle(app)