import React from "react";
import clsx from "clsx";
import { CustomCellProps } from "./withCustomCell";

import { makeStyles, createStyles, Grid } from "@material-ui/core";

import MultiSelect_ from "@antlerengineering/multiselect";
import FormattedChip, { VARIANTS } from "components/FormattedChip";
import { FieldType } from "constants/fields";
import { useFiretableContext } from "contexts/firetableContext";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },

    inputBase: {
      height: "100%",
      font: "inherit",
      color: "inherit !important",
      letterSpacing: "inherit",
    },

    select: {
      height: "100%",
      display: "flex",
      alignItems: "center",
      whiteSpace: "pre-line",
      padding: theme.spacing(0, 4, 0, 1.5),
      "&&": { paddingRight: theme.spacing(4) },
    },
    selectSingleLabel: {
      maxHeight: "100%",
      overflow: "hidden",
    },
    icon: { right: theme.spacing(1) },

    chipList: {
      overflowX: "hidden",
      width: "100%",
    },
    chip: { cursor: "inherit" },
    chipLabel: { whiteSpace: "nowrap" },
  })
);

export default function MultiSelect({
  rowIdx,
  column,
  value,
  onSubmit,
}: CustomCellProps) {
  const classes = useStyles();

  const { options } = column as any;
  const { dataGridRef } = useFiretableContext();

  // Support SingleSelect field
  const isSingle = (column as any).type === FieldType.singleSelect;

  // Render chips or basic string
  const renderValue = isSingle
    ? () =>
        typeof value === "string" && VARIANTS.includes(value.toLowerCase()) ? (
          <FormattedChip label={value} className={classes.chip} />
        ) : (
          <span className={classes.selectSingleLabel}>{value}</span>
        )
    : () => (
        <Grid container spacing={1} wrap="nowrap" className={classes.chipList}>
          {value?.map(
            item =>
              typeof item === "string" && (
                <Grid item key={item}>
                  <FormattedChip
                    label={item}
                    className={classes.chip}
                    classes={{ label: classes.chipLabel }}
                  />
                </Grid>
              )
          )}
        </Grid>
      );

  const handleOpen = () => {
    if (dataGridRef?.current?.selectCell)
      dataGridRef.current.selectCell({ rowIdx, idx: column.idx });
  };

  return (
    <MultiSelect_
      value={
        value === undefined || value === null ? (isSingle ? null : []) : value
      }
      onChange={onSubmit}
      freeText={false}
      multiple={!isSingle as any}
      label={column.name}
      labelPlural={column.name}
      options={options}
      disabled={column.editable === false}
      onOpen={handleOpen}
      TextFieldProps={
        {
          label: "",
          hiddenLabel: true,
          variant: "standard",
          className: classes.root,
          InputProps: {
            disableUnderline: true,
            classes: { root: classes.inputBase },
          },
          SelectProps: {
            classes: {
              root: clsx(classes.root, classes.select),
              icon: classes.icon,
            },
            renderValue,
            MenuProps: {
              anchorOrigin: { vertical: "bottom", horizontal: "left" },
              transformOrigin: { vertical: "top", horizontal: "left" },
            },
          },
        } as const
      }
    />
  );
}
