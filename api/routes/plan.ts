import { plan } from 'api/models'
import express from 'express'
import { Eventful } from 'types'

export const router = express.Router()

router.put<{ planId: string }>('/plan/:planId', async (req, res) => {
  const docPlan = await plan.findOneAndUpdate(
    { _id: req.params.planId },
    {
      ...req.body,
    },
    {
      new: true,
    }
  )
  return res.send(docPlan)
})
