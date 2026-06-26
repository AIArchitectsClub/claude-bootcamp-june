import { Router } from 'express';
import { sql } from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

// All booking routes require a valid session
router.use(requireAuth);

const TIME_SLOTS = [
  '07:00','08:00','09:00','10:00','11:00','12:00',
  '13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00',
];

router.get('/', async (req, res) => {
  try {
    const bookings = await sql`
      SELECT id,
             court_id       AS "courtId",
             court_name     AS "courtName",
             date::text     AS date,
             time,
             duration,
             player_name    AS "playerName",
             players,
             created_at     AS "createdAt"
      FROM bookings
      WHERE user_id = ${req.user.id}
      ORDER BY date, time
    `;
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { courtId, courtName, date, time, duration, playerName, players } = req.body;
  const userId = req.user.id;

  if (!courtId || !courtName || !date || !time || !playerName) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const startIndex = TIME_SLOTS.indexOf(time);
  if (startIndex === -1) return res.status(400).json({ error: 'Invalid time slot.' });

  const slots = TIME_SLOTS.slice(startIndex, startIndex + duration);
  if (slots.length < duration) return res.status(400).json({ error: 'Not enough consecutive slots.' });

  try {
    const conflicts = await sql`
      SELECT id FROM bookings
      WHERE court_id = ${courtId}
        AND date = ${date}
        AND time = ANY(${slots})
    `;
    if (conflicts.length > 0) {
      return res.status(409).json({ error: 'One or more slots are already booked.' });
    }

    const [booking] = await sql`
      INSERT INTO bookings (court_id, court_name, date, time, duration, player_name, players, user_id)
      VALUES (${courtId}, ${courtName}, ${date}, ${time}, ${duration}, ${playerName}, ${players}, ${userId})
      RETURNING
        id,
        court_id    AS "courtId",
        court_name  AS "courtName",
        date::text  AS date,
        time,
        duration,
        player_name AS "playerName",
        players,
        created_at  AS "createdAt"
    `;
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await sql`DELETE FROM bookings WHERE id = ${req.params.id} AND user_id = ${req.user.id}`;
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
