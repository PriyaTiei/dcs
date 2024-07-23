//has all of the functions to be used inside the routes
const Crankinfo = require("../models/crankHousing");



//to display all info in descending order
const crankDisplay = async(req, res) => {
    try {
        const  crank = await Crankinfo.find().sort({ createdAt: -1 });
        res.json(crank);
    } catch (error) {
        console.error('Error while fetching Crank Info ', error);
        res.status(500).json({ error: 'Failed to retrieve Crank Info' });
    }
};

// to display crank info using the id

const getCrankinfoById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const crank = await Crankinfo.findById(id);
  
      if (!crank) {
        return res.status(404).json({ message: "Info not found" });
      }
  
      res.status(200).json(crank);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to retrieve Info", error });
    }
  };


//to update crank info using id
const updateCrankinfoById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const crank = await Crankinfo.findByIdAndUpdate(id, req.body, { new: true });
  
      if (!crank) {
        return res.status(404).json({ message: "Crank info not found" });
      }
  
      res.status(200).json({ message: "Crank Info updated successfully", crank });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update Crank info", error });
    }
  };



// to delete crank info by id
  const deleteCrankinfoById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const crank = await Crankinfo.findByIdAndDelete(id);
  
      if (!crank) {
        return res.status(404).json({ message: "Crank Info not found" });
      }
  
      res.status(200).json({ message: "Crank info deleted successfully", crank });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to delete Crank info", error });
    }
  };

  //to create a new document in Db

  const createNewCrankinfo = async (req, res) => {
    console.log("create called");
    const {
      engineNo,
      crankHousingNum,
      crankHousingCastingNum
    } = req.body;
  
    try {
      const crank = new Crankinfo({
        engineNo,
        crankHousingNum,
        crankHousingCastingNum
      });
  
      await crank.save();
  
      res.status(201).json({ message: "New crank info document created successfully", crank });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create new document of Crank Info", error });
    }
  };
  


module.exports = {crankDisplay,getCrankinfoById, updateCrankinfoById,deleteCrankinfoById,createNewCrankinfo };