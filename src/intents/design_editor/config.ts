import type { Config } from "@canva/app-components";
import { useIntl } from "react-intl";

type ContainerTypes = "category" | "collection";

export const useConfig = (facets?: any): Config<ContainerTypes> => {
  const intl = useIntl();
  
  const categoriesOptions = facets?.category_paths?.map((b: any) => ({ value: b.value, label: b.label })) || [];
  const tagsOptions = facets?.tag_uuids?.map((b: any) => ({ value: b.value, label: b.label })) || [];
  const ratingOptions = facets?.average_rating?.map((b: any) => ({ value: String(b.value), label: b.label })) || [];

  return {
    serviceName: "Zuperix DAM",
    search: {
      enabled: true,
      filterFormConfig: {
        containerTypes: ["category", "collection"],
        filters: [
          ...(categoriesOptions.length > 0 ? [{
            filterType: "CHECKBOX",
            label: intl.formatMessage({
              defaultMessage: "Categories",
              description: "Label for categories filter",
            }),
            key: "category_paths",
            options: categoriesOptions,
            allowCustomValue: false,
          }] : []),
          ...(tagsOptions.length > 0 ? [{
            filterType: "CHECKBOX",
            label: intl.formatMessage({
              defaultMessage: "Tags",
              description: "Label for tags filter",
            }),
            key: "tag_uuids",
            options: tagsOptions,
            allowCustomValue: false,
          }] : []),
          {
            filterType: "CHECKBOX",
            label: intl.formatMessage({
              defaultMessage: "File Type",
              description: "Label for file type filter",
            }),
            key: "fileType",
            options: [
              { value: "image/png", label: "PNG" },
              { value: "image/jpeg", label: "JPEG" },
              { value: "image/svg+xml", label: "SVG" },
              { value: "video/mp4", label: "MP4" },
              { value: "application/pdf", label: "PDF" },
              { value: "image/gif", label: "GIF" },
            ],
            allowCustomValue: false,
          },
          {
            filterType: "CHECKBOX",
            label: intl.formatMessage({
              defaultMessage: "Orientation",
              description: "Label for orientation filter",
            }),
            key: "orientation",
            options: [
              { value: "landscape", label: "Landscape" },
              { value: "portrait", label: "Portrait" },
              { value: "square", label: "Square" },
            ],
            allowCustomValue: false,
          },
          {
            filterType: "CHECKBOX",
            label: intl.formatMessage({
              defaultMessage: "Status",
              description: "Label for status filter",
            }),
            key: "status",
            options: [
              { value: "active", label: "Active" },
              { value: "archived", label: "Archived" },
              { value: "draft", label: "Draft" },
            ],
            allowCustomValue: false,
          },
          {
            filterType: "CHECKBOX",
            label: intl.formatMessage({
              defaultMessage: "Average Rating",
              description: "Label for average rating filter",
            }),
            key: "average_rating",
            options: ratingOptions.length > 0 ? ratingOptions : [
              { value: "5", label: "5 Stars" },
              { value: "4", label: "4 Stars or above" },
              { value: "3", label: "3 Stars or above" },
            ],
            allowCustomValue: false,
          },
        ],
      },
    },
    containerTypes: [
      {
        value: "category",
        label: intl.formatMessage({
          defaultMessage: "Categories",
          description: "Name of the category container type",
        }),
        listingSurfaces: [
          {
            surface: "CONTAINER",
            parentContainerTypes: ["category"],
          },
        ],
        searchInsideContainer: {
          enabled: true,
          placeholder: intl.formatMessage({
            defaultMessage: "Search in this category",
            description: "Search placeholder inside a category",
          }),
        },
      },
      {
        value: "collection",
        label: intl.formatMessage({
          defaultMessage: "Collections",
          description: "Name of the collection container type",
        }),
        listingSurfaces: [],
        searchInsideContainer: {
          enabled: true,
          placeholder: intl.formatMessage({
            defaultMessage: "Search in this collection",
            description: "Search placeholder inside a collection",
          }),
        },
      },
    ],
    sortOptions: [
      {
        value: "created_at DESC",
        label: intl.formatMessage({
          defaultMessage: "Newest first",
          description: "Sort by newest",
        }),
      },
      {
        value: "created_at ASC",
        label: intl.formatMessage({
          defaultMessage: "Oldest first",
          description: "Sort by oldest",
        }),
      },
      {
        value: "name ASC",
        label: intl.formatMessage({
          defaultMessage: "Name (A-Z)",
          description: "Sort alphabetically",
        }),
      },
      {
        value: "name DESC",
        label: intl.formatMessage({
          defaultMessage: "Name (Z-A)",
          description: "Sort reverse alphabetically",
        }),
      },
    ],
    layouts: ["MASONRY", "LIST"],
    resourceTypes: ["IMAGE", "VIDEO", "EMBED"],
    moreInfoMessage: intl.formatMessage({
      defaultMessage:
        "Only images and videos are supported for drag-and-drop. Other file types may not appear.",
      description: "Info text about supported asset types",
    }),
    export: {
      enabled: true,
      containerTypes: ["category"],
      acceptedFileTypes: ["png", "jpg", "pdf_standard", "svg"],
    },
  };
};
