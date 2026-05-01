import * as React from "react";
import { SearchableListView } from "@canva/app-components";
import { Box, Button, Rows, Text, Title } from "@canva/app-ui-kit";
import "@canva/app-ui-kit/styles.css";
import { useConfig } from "./config";
import { findResources, connectAccount } from "./adapter";

declare const BACKEND_HOST: string;

export const App = () => {
  const [isConnected, setIsConnected] = React.useState<boolean>(true);
  const [facets, setFacets] = React.useState<any>(null);
  const config = useConfig(facets);

  React.useEffect(() => {
  }, []);

  const handleConnect = async () => {
    const success = await connectAccount();
    if (success) {
      setIsConnected(true);
    }
  };

  if (isConnected === false) {
    return (
      <Box
        height="full"
        padding="32"
        background="elevationSurface"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Rows spacing="32" align="center">
          <Rows spacing="12" align="center">
            <Title size="large" alignment="center">
              Connect Zuperix
            </Title>
            <Text size="medium" alignment="center">
              Access your Zuperix assets directly in Canva by connecting your
              account.
            </Text>
          </Rows>

          <Button variant="primary" onClick={handleConnect} fullWidth>
            Connect Zuperix
          </Button>

          <Text size="xsmall" tone="secondary" alignment="center">
            You will be redirected to Zuperix to authorize this application.
          </Text>
        </Rows>
      </Box>
    );
  }

  return (
    <Box height="full">
      <SearchableListView
        config={config}
        findResources={async (req) => {
          const res = await findResources(req);
          
          if (res.type === "SUCCESS" && (res as any).facets) {
            setFacets((res as any).facets);
          }

          if (res.type === "ERROR") {
            if (res.errorCode === "CONFIGURATION_REQUIRED") {
              if (isConnected !== false) {
                setIsConnected(false);
              }
              return { type: "SUCCESS", resources: [] };
            }
          }
          return res;
        }}
        saveExportedDesign={async (
          exportedDesignUrl: string,
          containerId: string | undefined,
          designTitle: string | undefined,
        ) => {
          try {
            const { auth } = await import("@canva/user");
            const userToken = await auth.getCanvaUserToken();

            const response = await fetch(
              `${BACKEND_HOST.replace(/\/$/, "")}/canva/dam/export`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${userToken}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  export_download_url: exportedDesignUrl,
                  destination_category_id: containerId,
                  file_name: designTitle,
                }),
              },
            );
            const body = await response.json();
            const data = body.data || body;
            return { success: !!data.id };
          } catch {
            return { success: false };
          }
        }}
      />
    </Box>
  );
};
