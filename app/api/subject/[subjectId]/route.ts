


export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");
    if (!subjectId) {
      return NextResponse.json(
        { error: "Missing subjectId parameter" },
        { status: 400 },
      );
    }
    const deletedSubject = await Subject.findOneAndDelete({
      _id: subjectId,
      userId,
    });
    if (!deletedSubject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting subject:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}