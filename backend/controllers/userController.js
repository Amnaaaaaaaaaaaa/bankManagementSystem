exports.getCreditScore = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId).select('creditScore');
  
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  
    res.json({
      success: true,
      creditScore: user.creditScore,
    });
  });
  