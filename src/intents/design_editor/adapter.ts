import type {
  FindResourcesRequest,
  FindResourcesResponse,
} from "@canva/app-components";
import { auth } from "@canva/user";
import { requestOpenExternalUrl } from "@canva/platform";

declare const BACKEND_HOST: string;
declare const FRONTEND_HOST: string;

export async function findResources(
  request: FindResourcesRequest<"category" | "collection">,
): Promise<FindResourcesResponse> {
  const userToken = await auth.getCanvaUserToken();

  const url = new URL(`${BACKEND_HOST.replace(/\/$/, "")}/canva/dam/resources`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    const body = await response.json();

    if (response.status === 401 && body.message === 'CANVA_NOT_CONNECTED') {
      return {
        type: "ERROR",
        errorCode: "CONFIGURATION_REQUIRED",
      };
    }

    const data = body.data || body;
    if (data.resources) {
      return {
        type: "SUCCESS",
        resources: data.resources,
        continuation: data.continuation,
        facets: data.facets,
      } as any;
    }
    return {
      type: "ERROR",
      errorCode: body.errorCode || "INTERNAL_ERROR",
    };
  } catch (err) {
    return {
      type: "ERROR",
      errorCode: "INTERNAL_ERROR",
    };
  }
}

export async function connectAccount() {
  try {
    const userToken = await auth.getCanvaUserToken();
    const authUrl = `${FRONTEND_HOST}/login?canva_token=${userToken}`;

    await requestOpenExternalUrl({
      url: authUrl,
    });

    return true;
  } catch (err) {
    console.error('Failed to open login via Canva SDK:', err);
    return false;
  }
}

