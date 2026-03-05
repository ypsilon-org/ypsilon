"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface EditUnitFormProps {
  unitId: string;
  currentName: string;
  currentDescription: string;
  unitColor: string;
}

export default function EditUnitForm({
  unitId,
  currentName,
  currentDescription,
  unitColor,
}: EditUnitFormProps) {
  const [name, setName] = useState(currentName);
  const [description, setDescription] = useState(currentDescription);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const isDirty =
    name.trim() !== currentName || description.trim() !== currentDescription;

  const handleSave = async () => {
    if (!name.trim()) {
      setMessage({ type: "error", text: "Unit name cannot be empty." });
      return;
    }
    setLoading(true);
    setMessage(null);

    const { error } = await supabase
      .from("units")
      .update({
        name: name.trim(),
        description: description.trim() || null,
      })
      .eq("id", unitId);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Unit identity updated." });
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        .euf-form { display: flex; flex-direction: column; gap: 1.2rem; }
        .euf-field { display: flex; flex-direction: column; gap: .4rem; }
        .euf-label {
          font-family: 'Cormorant Garamond', serif; font-size: .68rem;
          letter-spacing: .42em; text-transform: uppercase;
          color: #7D6328; font-weight: 300;
        }
        .euf-input, .euf-textarea {
          width: 100%; padding: .8rem 1rem;
          background: rgba(5,3,2,.85); border: 1px solid rgba(200,168,75,.12);
          color: #EDE3D0; font-family: 'EB Garamond', serif; font-size: 1rem;
          outline: none; transition: border-color .3s; border-radius: 0;
        }
        .euf-input::placeholder, .euf-textarea::placeholder {
          color: rgba(201,180,154,.2); font-style: italic;
        }
        .euf-input:focus, .euf-textarea:focus { border-color: rgba(200,168,75,.38); }
        .euf-textarea { resize: vertical; min-height: 80px; }
        .euf-hint {
          font-family: 'Cormorant Garamond', serif; font-size: .75rem;
          font-style: italic; color: rgba(201,180,154,.3); font-weight: 300;
        }
        .euf-footer { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
        .euf-btn {
          font-family: 'Cormorant Garamond', serif; font-size: .72rem; font-weight: 600;
          letter-spacing: .38em; text-transform: uppercase; color: #080604;
          padding: .82rem 2.2rem; border: 1px solid; cursor: pointer;
          transition: box-shadow .3s ease, opacity .2s;
        }
        .euf-btn:hover:not(:disabled) { box-shadow: 0 0 28px rgba(200,168,75,.28); }
        .euf-btn:disabled { opacity: .4; cursor: not-allowed; }
        .euf-msg {
          padding: .6rem 1rem;
          font-family: 'Cormorant Garamond', serif; font-size: .88rem; font-style: italic;
          border: 1px solid;
        }
        .euf-msg.success { background: rgba(200,168,75,.05); border-color: rgba(200,168,75,.22); color: rgba(200,168,75,.8); }
        .euf-msg.error   { background: rgba(139,10,10,.07); border-color: rgba(139,10,10,.28); color: rgba(220,150,150,.85); }
        .euf-preview {
          padding: 1.2rem 1.5rem;
          border: 1px solid rgba(200,168,75,.1);
          background: rgba(5,3,2,.5);
        }
        .euf-preview-label {
          font-family: 'Cormorant Garamond', serif; font-size: .62rem;
          letter-spacing: .4em; text-transform: uppercase;
          color: #7D6328; font-weight: 300; margin-bottom: .5rem;
        }
        .euf-preview-name {
          font-family: 'Playfair Display', serif; font-size: 1.4rem;
          font-weight: 700; font-style: italic; line-height: 1.1;
          margin-bottom: .35rem;
        }
        .euf-preview-desc {
          font-family: 'EB Garamond', serif; font-size: .92rem;
          font-style: italic; color: rgba(201,180,154,.5); line-height: 1.6;
        }
      `}</style>

      <div className="euf-form">
        {/* Live preview */}
        <div className="euf-preview">
          <p className="euf-preview-label">Preview</p>
          <p className="euf-preview-name" style={{ color: unitColor }}>
            {name.trim() || "Unit Name"}
          </p>
          {description.trim() && (
            <p className="euf-preview-desc">{description.trim()}</p>
          )}
        </div>

        <div className="euf-field">
          <label className="euf-label">Unit Name</label>
          <input
            className="euf-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter unit name..."
            maxLength={80}
          />
        </div>

        <div className="euf-field">
          <label className="euf-label">Description</label>
          <textarea
            className="euf-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your unit's legacy..."
            maxLength={300}
          />
          <p className="euf-hint">
            Shown to all members on their dashboard and across the platform.
          </p>
        </div>

        <div className="euf-footer">
          <button
            className="euf-btn"
            style={{
              background: isDirty ? unitColor : "rgba(200,168,75,.3)",
              borderColor: isDirty ? unitColor : "rgba(200,168,75,.2)",
            }}
            onClick={handleSave}
            disabled={loading || !isDirty}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          {message && (
            <div className={`euf-msg ${message.type}`}>{message.text}</div>
          )}
        </div>
      </div>
    </>
  );
}
