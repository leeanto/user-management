import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  content: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, title, content, onConfirm, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <p>{content}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
