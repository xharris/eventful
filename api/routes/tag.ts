import express from 'express'

export const router = express.Router()

router.post('/tag/create', async (req, res) => {})

router.put('/tag/:tagId', async (req, res) => {})

router.delete('/tag/:tagId', async (req, res) => {})

/** get all tags a user created / has access to */
router.get('/user/:userId/tags', async (req, res) => {})

/** list of users that have access to a tag */
router.get('/tag/:tagId/users', async (req, res) => {})

/** give access to a tag */
router.put('/tag/:tagId/addUser/:userId', async (req, res) => {})

/** remove access to a tag */
router.put('/tag/:tagId/removeUser/:userId', async (req, res) => {})
