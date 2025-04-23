import { BlobServiceClient, generateBlobSASQueryParameters, SASProtocol, BlobSASPermissions, StorageSharedKeyCredential } from "@azure/storage-blob";
import { NextResponse } from "next/server";

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = "images";

export async function GET() {
  try {
    if (!connectionString) {
      throw new Error("Azure Storage connection string is not configured");
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

    // Generate SAS token
    const startsOn = new Date();
    const expiresOn = new Date(new Date().valueOf() + 3600 * 1000); // 1 hour from now

    const sasOptions = {
      containerName,
      permissions: BlobSASPermissions.parse("racwd"), // Read, Add, Create, Write, Delete
      startsOn,
      expiresOn,
      protocol: SASProtocol.Https
    };
    console.log(blobServiceClient.credential)
    const sasToken = generateBlobSASQueryParameters(
      sasOptions,
      blobServiceClient.credential as StorageSharedKeyCredential
    ).toString();


    const containerClient = blobServiceClient.getContainerClient(containerName);
    const containerUrl = containerClient.url;

    return NextResponse.json({
      success: true,
      sasToken,
      containerUrl
    });
  } catch (error) {
    console.error("Error generating SAS token:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate SAS token" },
      { status: 500 }
    );
  }
}