/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useCallback, type FormEvent } from "react";
import Container from "@/components/shared/Container";
import { AddButton } from "@/components/shared/ActionButtons";
import useFormSubmit from "@/hooks/useFormSubmit";
import { FormField, SectionProps } from "../../types";
import { X, Plus, Trash2, Edit2, GripVertical } from "lucide-react";

type FormValues = Record<string, string | string[]>;

const normalizeFieldId = (field: FormField, index: number) =>
  field.id ||
  field.label.toLowerCase().replace(/[^a-z0-9]+/g, "_") ||
  `field_${index}`;

const toText = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value.join(", ") : (value ?? "");

const fieldTypeOptions = [
  "text",
  "email",
  "phone",
  "textarea",
  "select",
  "radio",
  "checkbox",
] as const;

// Field Editor Modal
const FieldEditorModal: React.FC<{
  field: FormField | null;
  onSave: (field: FormField) => void;
  onClose: () => void;
}> = ({ field, onSave, onClose }) => {
  const [editField, setEditField] = useState<FormField>(
    () =>
      field || {
        id: `field_${Math.random().toString(36).slice(2)}`,
        label: "",
        type: "text",
        required: false,
        placeholder: "",
        helpText: "",
        options: [],
      },
  );

  if (!field && !editField) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="rounded-xl bg-white p-6 shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-lg">Edit Field</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Label */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Label *
            </label>
            <input
              type="text"
              value={editField.label}
              onChange={(e) =>
                setEditField({ ...editField, label: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Field label"
            />
          </div>

          {/* Field Type */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Type *
            </label>
            <select
              value={editField.type}
              onChange={(e) =>
                setEditField({
                  ...editField,
                  type: e.target.value as FormField["type"],
                  options:
                    e.target.value === "select" ||
                    e.target.value === "radio" ||
                    e.target.value === "checkbox"
                      ? editField.options || ["Option 1", "Option 2"]
                      : undefined,
                })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {fieldTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Placeholder */}
          {editField.type !== "select" &&
            editField.type !== "radio" &&
            editField.type !== "checkbox" && (
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Placeholder
                </label>
                <input
                  type="text"
                  value={editField.placeholder || ""}
                  onChange={(e) =>
                    setEditField({ ...editField, placeholder: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="e.g., Enter your name"
                />
              </div>
            )}

          {/* Help Text */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Help Text
            </label>
            <input
              type="text"
              value={editField.helpText || ""}
              onChange={(e) =>
                setEditField({ ...editField, helpText: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Additional help text"
            />
          </div>

          {/* Options for select/radio/checkbox */}
          {(editField.type === "select" ||
            editField.type === "radio" ||
            editField.type === "checkbox") && (
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Options (comma-separated)
              </label>
              <textarea
                value={(editField.options || []).join(", ")}
                onChange={(e) =>
                  setEditField({
                    ...editField,
                    options: e.target.value
                      .split(",")
                      .map((opt) => opt.trim())
                      .filter(Boolean),
                  })
                }
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                placeholder="Option 1, Option 2, Option 3"
              />
            </div>
          )}

          {/* Required */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={editField.required || false}
              onChange={(e) =>
                setEditField({ ...editField, required: e.target.checked })
              }
              className="rounded"
            />
            <span className="text-sm font-semibold text-gray-700">
              Required field
            </span>
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(editField);
              onClose();
            }}
            className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export const FormSection = ({
  isEditor,
  content,
  onUpdate,
  position,
  anchorName,
  slugs,
}: SectionProps) => {
  const isEven = position % 2 === 0;
  const fields = useMemo(
    () =>
      Array.isArray((content as any).fields)
        ? ((content as any).fields as FormField[])
        : [],
    [content],
  );
  const steps = useMemo(() => (content as any).steps || [], [content]);
  const showProgressBar = (content as any).showProgressBar ?? true;

  const [values, setValues] = useState<FormValues>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const submitForm = useFormSubmit();

  // Get fields for current step
  const fieldsForStep =
    steps.length > 0
      ? fields.filter((f) => (f.step ?? 0) === currentStep)
      : fields;

  // Add step
  const addStep = () => {
    const newSteps = [
      ...steps,
      { id: `step_${Date.now()}`, title: `Step ${steps.length + 1}` },
    ];
    onUpdate("steps", newSteps);
  };

  // Delete step
  const deleteStep = (stepIndex: number) => {
    const newSteps = steps.filter((_: any, i: number) => i !== stepIndex);
    const updatedFields = fields.map((f: FormField) => ({
      ...f,
      step: (f.step ?? 0) > stepIndex ? (f.step ?? 0) - 1 : f.step,
    }));
    onUpdate("steps", newSteps);
    if (updatedFields.length > 0) {
      onUpdate("fields", updatedFields);
    }
    if (currentStep >= newSteps.length) {
      setCurrentStep(Math.max(0, newSteps.length - 1));
    }
  };

  const setValue = (id: string, value: string | string[]) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const next = fields.map((field, fieldIndex) =>
      fieldIndex === index ? { ...field, ...updates } : field,
    );
    onUpdate("fields", next);
  };

  const addField = useCallback(
    (index?: number) => {
      const newField: FormField = {
        id: `field_${Math.random().toString(36).slice(2)}`,
        label: "New Field",
        type: "text",
        required: false,
        placeholder: "",
        step: currentStep,
      };

      let nextFields;
      let globalIndex;
      if (typeof index === "number") {
        nextFields = [...fields];
        nextFields.splice(index, 0, newField);
        globalIndex = index;
      } else {
        nextFields = [...fields, newField];
        globalIndex = nextFields.length - 1;
      }

      onUpdate("fields", nextFields);
      setEditingField(newField);
      setEditingIndex(globalIndex);
    },
    [currentStep, fields, onUpdate],
  );

  const deleteField = (index: number) => {
    onUpdate(
      "fields",
      fields.filter((_, i) => i !== index),
    );
  };

  const handleSaveField = (field: FormField) => {
    if (editingIndex !== null) {
      updateField(editingIndex, field);
    }
    setEditingField(null);
    setEditingIndex(null);
  };

  const validateStep = useCallback((stepIdx: number) => {
    const stepFields = fields.filter((f) => (f.step ?? 0) === stepIdx);
    for (const field of stepFields) {
      if (field.required) {
        const id = normalizeFieldId(field, fields.indexOf(field));
        const value = values[id];
        if (!value || (Array.isArray(value) && value.length === 0) || (typeof value === "string" && value.trim() === "")) {
          return false;
        }
      }
    }
    return true;
  }, [fields, values]);

  const handleNext = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      setSubmitError(null);
    } else {
      setSubmitError("Please fill in all required fields.");
    }
  }, [currentStep, validateStep]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEditor) return;

    if (steps.length > 0 && currentStep < steps.length - 1) {
      handleNext();
      return;
    }

    if (!validateStep(currentStep)) {
      setSubmitError("Please fill in all required fields.");
      return;
    }

    const answers = fields
      .map((field, index) => {
        const id = normalizeFieldId(field, index);
        return {
          id,
          label: field.label,
          value: values[id] ?? "",
          type: field.type,
        };
      })
      .filter((field) =>
        Array.isArray(field.value) ? field.value.length > 0 : field.value.trim().length > 0,
      );

    // For multi-step, we might want to derive name/email from the answers if not explicitly in emptyFormData
    const nameField = answers.find(a => a.label.toLowerCase().includes("name"))?.value;
    const emailField = answers.find(a => a.label.toLowerCase().includes("email"))?.value;

    await submitForm({
      formData: {
        name: toText(nameField) || "Form User",
        email: toText(emailField) || "no-email@provided.com",
        message: `Form Submission: ${(content as any).title ?? "Quick Form"}`,
      },
      setFormData: () => setValues({}),
      setSubmitting,
      setSubmitSuccess,
      setSubmitError,
      siteSlug: slugs?.slug,
      anchorName,
      messageType: "form",
      formTitle: (content as any).title ?? "Quick Form",
      fields: answers,
    });
  };

  const renderInput = (field: FormField, index: number) => {
    const id = normalizeFieldId(field, index);
    const value = values[id] ?? "";
    const commonClass =
      "w-full rounded-xl px-4 py-3 outline-none disabled:opacity-60";
    const commonStyle = {
      background: "var(--qs-bg)",
      border: "1px solid var(--qs-border)",
      color: "var(--qs-text)",
    };

    if (field.type === "textarea") {
      return (
        <textarea
          rows={5}
          required={field.required}
          disabled={isEditor || submitting}
          placeholder={field.placeholder}
          className={`${commonClass} resize-none`}
          style={commonStyle}
          value={toText(value)}
          onChange={(e) => setValue(id, e.target.value)}
        />
      );
    }

    if (field.type === "select") {
      return (
        <select
          required={field.required}
          disabled={isEditor || submitting}
          className={commonClass}
          style={commonStyle}
          value={toText(value)}
          onChange={(e) => setValue(id, e.target.value)}
        >
          <option value="">Select an option</option>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "radio" || field.type === "checkbox") {
      const selected = Array.isArray(value) ? value : [];
      return (
        <div className="space-y-2">
          {(field.options ?? []).map((option) => (
            <label key={option} className="flex items-center gap-3 text-sm">
              <input
                type={field.type}
                name={id}
                value={option}
                disabled={isEditor || submitting}
                checked={
                  field.type === "radio"
                    ? value === option
                    : selected.includes(option)
                }
                onChange={(e) => {
                  if (field.type === "radio") {
                    setValue(id, option);
                    return;
                  }
                  setValue(
                    id,
                    e.target.checked
                      ? [...selected, option]
                      : selected.filter((item) => item !== option),
                  );
                }}
              />
              <span style={{ color: "var(--qs-text)" }}>{option}</span>
            </label>
          ))}
        </div>
      );
    }

    return (
      <input
        type={field.type === "phone" ? "tel" : field.type}
        required={field.required}
        disabled={isEditor || submitting}
        placeholder={field.placeholder}
        className={commonClass}
        style={commonStyle}
        value={toText(value)}
        onChange={(e) => setValue(id, e.target.value)}
      />
    );
  };

  return (
    <section
      id={anchorName}
      style={{ background: isEven ? "var(--qs-bg)" : "var(--qs-bg-alt)" }}
    >
      <Container className="py-12 sm:py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <div
            className="rounded-2xl border p-5 sm:p-8 md:p-10"
            style={{
              background: isEven ? "var(--qs-bg-alt)" : "var(--qs-bg)",
              borderColor: "var(--qs-border)",
            }}
          >
            {isEditor && steps.length > 0 && (
              <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-gray-100 pb-6">
                {steps.map((step: any, idx: number) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1 shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setCurrentStep(idx)}
                      className={`rounded px-3 py-1.5 text-xs font-bold uppercase transition ${
                        currentStep === idx
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {step.title || `Step ${idx + 1}`}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteStep(idx)}
                      className="p-1 rounded hover:bg-red-50 text-red-500 transition"
                      disabled={steps.length === 1}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addStep}
                  className="flex items-center gap-1 rounded border border-dashed border-gray-300 px-3 py-1.5 text-xs font-bold uppercase text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-all"
                >
                  <Plus size={12} />
                  Add Step
                </button>
              </div>
            )}

            {isEditor && steps.length === 0 && (
              <div className="mb-8 flex justify-end">
                <button
                  type="button"
                  onClick={addStep}
                  className="flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase text-blue-600 hover:bg-blue-100 transition-all"
                >
                  <Plus size={12} />
                  Convert to Multi-Step
                </button>
              </div>
            )}

            <div className="mb-8">
              <p
                className="mb-3 text-xs font-bold uppercase tracking-[0.25em]"
                style={{ color: "var(--qs-primary)" }}
              >
                Form
              </p>
              <h2
                className="text-2xl sm:text-4xl font-black tracking-tight"
                style={{ color: "var(--qs-text)" }}
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate("title", e.currentTarget.textContent?.trim())
                }
              >
                {(content as any).title ?? "Quick Form"}
              </h2>
              <p
                className="mt-3 text-sm sm:text-base leading-relaxed"
                style={{ color: "var(--qs-text-muted)" }}
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate("desc", e.currentTarget.textContent?.trim())
                }
              >
                {(content as any).desc ?? "Fill out the form below."}
              </p>
            </div>

            {/* Progress Bar for Multi-Step */}
            {steps.length > 0 && (showProgressBar || isEditor) && (
              <div className="mb-6">
                <div className="flex items-center gap-2 sm:gap-4">
                  {steps.map((step: any, idx: number) => (
                    <div key={step.id} className="flex-1 flex items-center">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition ${
                          idx <= currentStep
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}
                        style={
                          idx <= currentStep
                            ? { background: "var(--qs-primary)" }
                            : {}
                        }
                      >
                        {idx + 1}
                      </div>
                      {idx < steps.length - 1 && (
                        <div
                          className={`flex-1 h-1 mx-2 transition ${
                            idx < currentStep ? "bg-indigo-600" : "bg-gray-300"
                          }`}
                          style={
                            idx < currentStep
                              ? { background: "var(--qs-primary)" }
                              : {}
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
                <p
                  className="text-sm mt-2"
                  style={{ color: "var(--qs-text-muted)" }}
                >
                  {steps[currentStep]?.title || `Step ${currentStep + 1}`} of{" "}
                  {steps.length}
                </p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {fieldsForStep.map((field, index) => (
                <div
                  key={field.id || normalizeFieldId(field, index)}
                  className="relative group/field"
                >
                  {isEditor && (
                    <div className="absolute -top-3 left-0 right-0 flex justify-center opacity-0 group-hover/field:opacity-100 transition-all z-10 pointer-events-none">
                      <button
                        type="button"
                        onClick={() => addField(fields.indexOf(field))}
                        className="pointer-events-auto bg-white border border-blue-200 text-blue-600 rounded-full p-1 shadow-md hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                        title="Insert field here"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  )}
                  <div
                    className={`space-y-2 ${isEditor ? "p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-all relative" : ""}`}
                  >
                    {isEditor && (
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition">
                            <GripVertical size={16} />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                            {field.type}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingIndex(fields.indexOf(field));
                              setEditingField(field);
                            }}
                            className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition"
                            title="Edit field settings"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteField(fields.indexOf(field))}
                            className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition"
                            title="Remove field"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                    <label
                      className="block text-sm font-bold"
                      style={{ color: "var(--qs-text)" }}
                      contentEditable={isEditor}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        updateField(fields.indexOf(field), {
                          label:
                            e.currentTarget.textContent?.trim() || field.label,
                        })
                      }
                    >
                      {field.label}
                      {field.required ? " *" : ""}
                    </label>
                    {field.helpText && (
                      <p
                        className="text-xs"
                        style={{ color: "var(--qs-text-muted)" }}
                        contentEditable={false}
                        suppressContentEditableWarning
                      >
                        {field.helpText}
                      </p>
                    )}
                    {renderInput(field, index)}
                  </div>
                </div>
              ))}

              {isEditor && (
                <div className="flex justify-center pt-4">
                  <AddButton onClick={() => addField()}>
                    Add Form Field
                  </AddButton>
                </div>
              )}

              {/* Step Navigation */}
              {steps.length > 0 && !isEditor && (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="w-full sm:flex-1 rounded-xl px-6 py-3 font-semibold transition border disabled:opacity-30"
                    style={{
                      borderColor: "var(--qs-border)",
                      color: "var(--qs-text)",
                    }}
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:flex-1 rounded-xl px-6 py-3 font-semibold transition disabled:opacity-60"
                    style={{
                      background: "var(--qs-primary)",
                      color: "var(--qs-primary-fg)",
                    }}
                  >
                    {submitting 
                      ? "Submitting..." 
                      : currentStep < steps.length - 1 
                        ? "Next" 
                        : "Submit"}
                  </button>
                </div>
              )}

              {/* Single Step Submit */}
              {steps.length === 0 && (
                <button
                  type={isEditor ? "button" : "submit"}
                  disabled={!isEditor && submitting}
                  className="w-full rounded-xl px-6 py-4 font-bold transition hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                  style={{
                    background: "var(--qs-primary)",
                    color: "var(--qs-primary-fg)",
                  }}
                >
                  <span
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onUpdate(
                        "buttonLabel",
                        e.currentTarget.textContent?.trim(),
                      )
                    }
                  >
                    {submitting && !isEditor
                      ? "Submitting..."
                      : ((content as any).buttonLabel ?? "Submit Response")}
                  </span>
                </button>
              )}

              {submitSuccess && !isEditor && (
                <p
                  className="text-center text-sm"
                  style={{ color: "var(--qs-primary)" }}
                >
                  {(content as any).successMessage ??
                    "Thanks! Your response has been recorded."}
                </p>
              )}
              {submitError && !isEditor && (
                <p className="text-center text-sm text-red-500">
                  {submitError}
                </p>
              )}
            </form>
          </div>
        </div>
      </Container>

      {/* Field Editor Modal */}
      {isEditor && editingField && (
        <FieldEditorModal
          field={editingField}
          onSave={handleSaveField}
          onClose={() => {
            setEditingField(null);
            setEditingIndex(null);
          }}
        />
      )}
    </section>
  );
};
