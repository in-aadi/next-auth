import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function POST(request: NextRequest) {
	const userId = await getDataFromToken(request);
	const user = await User.findOne({ _id: userId }).select("-password");
	if (!user) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}
	return NextResponse.json({
		message: "User found",
		data: user,
	});
}
