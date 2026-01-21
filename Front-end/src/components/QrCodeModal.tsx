import { Modal } from "antd";
import { QRCodeCanvas } from "qrcode.react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  code: string;
};

function QrCodeModal({ open, onClose, title = "Your Ticket QR", code }: Props) {
  return (
    <Modal open={open} onCancel={onClose} footer={null} title={title} centered>
      <div className="flex flex-col items-center gap-3">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <QRCodeCanvas value={code} size={220} includeMargin />
        </div>
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Booking Code</p>
          <p className="mt-1 font-mono text-sm font-bold tracking-[0.2em] text-[var(--text)]">{code}</p>
          <p className="mt-2 text-xs text-[var(--muted)]">Show this at the entrance for check-in.</p>
        </div>
      </div>
    </Modal>
  );
}

export default QrCodeModal;
