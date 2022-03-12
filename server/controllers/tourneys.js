import TourneyData from "../schemas/tourneys.js"

export const getTourneys = async (req, res) => {
    try {
        const allTourneys = await TourneyData.find()
        res.status(200).json(allTourneys)
    } catch (err) {
        res.status(404).json({message: err.message})
    }
    
}

export const createTourney = async (req, res) => {
    const newTourney = new TourneyData(req.body)

    try {
        await newTourney.save()
        res.status(201).json(newTourney)
    } catch (err) {
        res.status(409).json({message: err.message})
    }
}

export const getTourneyInfo = async (req, res) => {
    try {
        const tourney = await TourneyData.find({_id: req.params.id});
        res.status(200).json(tourney);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
}