import Department from "../models/Department.js";

const addDepartment = async (req, res) => {
  try {
    const { dep_name, description } = await req.body;
    const newDepartment = new Department({
      dep_name,
      description,
    });

    await newDepartment.save();
    res.status(201).json({
      success: true,
      message: "Department added successfully",
      department: newDepartment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server side Error",
    });
  }
};

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json({
      success: true,
      departments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server side Error",
    });
  }
};

const editDepartment = async (req, res) => {
  const { _id } = req.params;
  try {
    const department = await Department.findById(_id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }
    res.status(200).json({
      success: true,
      department,
    });


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server side Error",
    });
  }
}

const updateDepartment = async (req, res) => {
  const { _id } = req.params;
  const { dep_name, description } = req.body;


  try {
    const updateDep = await Department.findByIdAndUpdate(
      _id,
      { dep_name, description },
    );

    if (!updateDep) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      updateDep,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server side Error",
    });
  }
};

const deleteDepartment = async (req, res) => {
  const { _id } = req.params;
  try {
    const delDepartment = await Department.findByIdAndDelete(_id);
    if (!delDepartment) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
      delDepartment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server side Error",
    });
  }
}

export {
  addDepartment,
  getDepartments,
  editDepartment,
  updateDepartment,
  deleteDepartment,
};
