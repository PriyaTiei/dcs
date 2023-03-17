const DefectForm = require("../models/dcs");

exports.createDefectForm = async (req, res) => {
  try {
    const { date, time, partNo, remarks, defectType, image } = req.body;
    const defectForm = new DefectForm({
      date,
      time,
      partNo,
      remarks,
      defectType,
      image,
    });
    await defectForm.save();
    res.status(201).json({ message: "Defect form created successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getDefectForms = async (req, res) => {
  try {
    const defectForms = await DefectForm.find();
    res.status(200).json({ defectForms });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getDefectFormById = async (req, res) => {
  try {
    const { id } = req.params;
    const defectForm = await DefectForm.findById(id);
    if (!defectForm) {
      return res.status(404).json({ error: "Defect form not found" });
    }
    res.status(200).json({ defectForm });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateDefectFormById = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, partNo, remarks, image } = req.body;
    const defectForm = await DefectForm.findByIdAndUpdate(id, {
      date,
      time,
      partNo,
      remarks,
      image,
    });
    if (!defectForm) {
      return res.status(404).json({ error: "Defect form not found" });
    }
    res.status(200).json({ message: "Defect form updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteDefectFormById = async (req, res) => {
  try {
    const { id } = req.params;
    const defectForm = await DefectForm.findByIdAndDelete(id);
    if (!defectForm) {
      return res.status(404).json({ error: "Defect form not found" });
    }
    res.status(200).json({ message: "Defect form deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
