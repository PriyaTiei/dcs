const DCS = require('../models/dcs');
 
exports.createDCS = async (req, res) => {
  const {
    date,
    time,
    engineNo,
    engineCode,
    defectContent,
    remarks,
    checker,
    image,
    pqcs
  } = req.body;

  try {
    const dcs = new DCS({
      date,
      time,
      engineNo,
      engineCode,
      defectContent,
      remarks,
      checker,
      image,
      pqcs
    });

    await dcs.save();

    res.status(201).json({ message: 'DCS created successfully', dcs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create DCS', error });
  }
};
 
exports.getAllDCS = async (req, res) => {
  try {
    const dcs = await DCS.find().sort({ createdAt: -1 });

    res.status(200).json(dcs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve DCS documents', error });
  }
};
 
exports.getDCSById = async (req, res) => {
  const { id } = req.params;

  try {
    const dcs = await DCS.findById(id);

    if (!dcs) {
      return res.status(404).json({ message: 'DCS not found' });
    }

    res.status(200).json(dcs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve DCS document', error });
  }
};
 
exports.updateDCSById = async (req, res) => {
  const { id } = req.params;

  try {
    const dcs = await DCS.findByIdAndUpdate(id, req.body, { new: true });

    if (!dcs) {
      return res.status(404).json({ message: 'DCS not found' });
    }

    res.status(200).json({ message: 'DCS updated successfully', dcs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update DCS document', error });
  }
};
 
exports.deleteDCSById = async (req, res) => {
  const { id } = req.params;

  try {
    const dcs = await DCS.findByIdAndDelete(id);

    if (!dcs) {
      return res.status(404).json({ message: 'DCS not found' });
    }

    res.status(200).json({ message: 'DCS deleted successfully', dcs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete DCS document', error });
  }
};