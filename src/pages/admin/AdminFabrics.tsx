import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
  Image,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/client";
import type { Fabric } from "../../types";
import { NumericFormat } from "react-number-format";

const emptyFabric = {
  name: "",
  description: "",
  composition: "",
  width: "",
  density: "",
  price: 0,
  priceUnit: "за метр",
  currency: "сум",
  isActive: true,
  order: "0",
};

export default function AdminFabrics() {
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Fabric form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyFabric });

  // Color form
  const [colorForm, setColorForm] = useState({ article: "", name: "" });
  const [colorFile, setColorFile] = useState<File | null>(null);
  const [colorPreview, setColorPreview] = useState<string | null>(null);
  const [colorFabricId, setColorFabricId] = useState<string | null>(null);
  const [addingColor, setAddingColor] = useState(false);

  // Color editing
  const [editingColorId, setEditingColorId] = useState<string | null>(null);
  const [editColorForm, setEditColorForm] = useState({ article: "", name: "" });
  const [editColorFile, setEditColorFile] = useState<File | null>(null);
  const [editColorPreview, setEditColorPreview] = useState<string | null>(null);
  const [savingColor, setSavingColor] = useState(false);

  const load = () => {
    api
      .get("/fabrics/admin")
      .then((r) => setFabrics(r.data))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyFabric });
    setShowForm(true);
  };

  const openEdit = (f: Fabric) => {
    setEditingId(f._id);
    setForm({
      name: f.name,
      description: f.description,
      composition: f.composition,
      width: f.width,
      density: f.density,
      price: String(f.price),
      priceUnit: f.priceUnit,
      currency: f.currency,
      isActive: f.isActive as unknown as boolean,
      order: String(f.order),
    } as any);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/fabrics/${editingId}`, form);
        toast.success("Ткань обновлена");
      } else {
        await api.post("/fabrics", form);
        toast.success("Ткань добавлена");
      }
      setShowForm(false);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Ошибка сохранения");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить ткань и все расцветки?")) return;
    await api.delete(`/fabrics/${id}`);
    toast.success("Ткань удалена");
    load();
  };

  const handleColorFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setColorFile(file);
    if (file) setColorPreview(URL.createObjectURL(file));
  };

  const handleAddColor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!colorFabricId) return;
    setAddingColor(true);
    const fd = new FormData();
    if (colorFile) fd.append("image", colorFile);
    fd.append("article", colorForm.article);
    fd.append("name", colorForm.name);
    try {
      await api.post(`/fabrics/${colorFabricId}/colors`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Расцветка добавлена");
      setColorForm({ article: "", name: "" });
      setColorFile(null);
      setColorPreview(null);
      load();
    } catch {
      toast.error("Ошибка загрузки");
    } finally {
      setAddingColor(false);
    }
  };

  const openEditColor = (
    fabricId: string,
    colorId: string,
    article: string,
    name: string,
    imageUrl: string
  ) => {
    setEditingColorId(`${fabricId}__${colorId}`);
    setEditColorForm({ article, name });
    setEditColorFile(null);
    setEditColorPreview(imageUrl || null);
    // Close add form
    setColorFabricId(null);
  };

  const handleSaveColor = async (
    e: React.FormEvent,
    fabricId: string,
    colorId: string
  ) => {
    e.preventDefault();
    setSavingColor(true);
    const fd = new FormData();
    if (editColorFile) fd.append("image", editColorFile);
    fd.append("article", editColorForm.article);
    fd.append("name", editColorForm.name);
    try {
      await api.put(`/fabrics/${fabricId}/colors/${colorId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Расцветка обновлена");
      setEditingColorId(null);
      load();
    } catch {
      toast.error("Ошибка сохранения");
    } finally {
      setSavingColor(false);
    }
  };

  const handleDeleteColor = async (fabricId: string, colorId: string) => {
    if (!confirm("Удалить расцветку?")) return;
    await api.delete(`/fabrics/${fabricId}/colors/${colorId}`);
    toast.success("Расцветка удалена");
    load();
  };

  const fabricFields = [
    { key: "name", label: "Название *", required: true },
    { key: "description", label: "Описание", required: false },
    {
      key: "composition",
      label: "Состав (напр. 100% хлопок)",
      required: false,
    },
    { key: "width", label: "Ширина (напр. 220 см)", required: false },
    { key: "density", label: "Плотность (напр. 120 г/м²)", required: false },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light text-brand-dark">
            Ткани
          </h1>
          <p className="font-body text-brand-muted text-sm mt-1">
            Управление ассортиментом
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-brand-primary text-white px-5 py-3 font-body text-sm tracking-wider hover:bg-brand-dark transition-colors"
        >
          <Plus size={18} /> Добавить ткань
        </button>
      </div>

      {/* Fabric form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl text-brand-dark">
                {editingId ? "Редактировать ткань" : "Новая ткань"}
              </h2>
              <button onClick={() => setShowForm(false)}>
                <X
                  size={20}
                  className="text-brand-muted hover:text-brand-dark"
                />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {fabricFields.map(({ key, label, required }) => (
                <div key={key}>
                  <label className="block font-body text-xs tracking-[0.2em] uppercase text-brand-muted mb-1">
                    {label}
                  </label>
                  <input
                    type="text"
                    required={required}
                    value={(form as any)[key]}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [key]: e.target.value }))
                    }
                    className="w-full border border-brand-light px-3 py-2 font-body text-sm text-brand-dark focus:outline-none focus:border-brand-primary"
                  />
                </div>
              ))}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-body text-xs tracking-[0.2em] uppercase text-brand-muted mb-1">
                    Цена *
                  </label>
                  <NumericFormat
                    required
                    thousandSeparator=" "
                    value={form.price}
                    onValueChange={(e: any) =>
                      setForm((p) => ({
                        ...p,
                        price: Number(e.floatValue) || 0,
                      }))
                    }
                    className="w-full border border-brand-light px-3 py-2 font-body text-sm focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block font-body text-xs tracking-[0.2em] uppercase text-brand-muted mb-1">
                    Единица
                  </label>
                  <input
                    type="text"
                    value={form.priceUnit}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, priceUnit: e.target.value }))
                    }
                    className="w-full border border-brand-light px-3 py-2 font-body text-sm focus:outline-none focus:border-brand-primary"
                    placeholder="за метр"
                  />
                </div>
                <div>
                  <label className="block font-body text-xs tracking-[0.2em] uppercase text-brand-muted mb-1">
                    Валюта
                  </label>
                  <input
                    type="text"
                    value={form.currency}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, currency: e.target.value }))
                    }
                    className="w-full border border-brand-light px-3 py-2 font-body text-sm focus:outline-none focus:border-brand-primary"
                    placeholder="сум"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-body text-xs tracking-[0.2em] uppercase text-brand-muted mb-1">
                    Порядок
                  </label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, order: e.target.value }))
                    }
                    className="w-full border border-brand-light px-3 py-2 font-body text-sm focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive as unknown as boolean}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          isActive: e.target.checked as any,
                        }))
                      }
                      className="w-4 h-4 accent-brand-primary"
                    />
                    <span className="font-body text-sm text-brand-dark">
                      Активна
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-brand-primary text-white font-body text-sm tracking-wider py-3 hover:bg-brand-dark transition-colors"
                >
                  {editingId ? "Сохранить" : "Добавить"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 border border-brand-light text-brand-muted font-body text-sm hover:bg-brand-cream transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fabrics list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : fabrics.length === 0 ? (
        <div className="text-center py-16 text-brand-muted font-body">
          Ткани не добавлены. Нажмите «Добавить ткань».
        </div>
      ) : (
        <div className="space-y-3">
          {fabrics.map((fabric) => (
            <div key={fabric._id} className="bg-white">
              {/* Row header */}
              <div className="flex items-center gap-4 p-5">
                <div className="w-14 h-14 bg-brand-cream flex-shrink-0 overflow-hidden">
                  {fabric.colors[0]?.imageUrl ? (
                    <img
                      src={fabric.colors[0].imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image size={18} className="text-brand-muted" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-body font-medium text-brand-dark truncate">
                      {fabric.name}
                    </h3>
                    {!fabric.isActive && (
                      <span className="text-xs bg-brand-beige text-brand-muted px-2 py-0.5 rounded-sm">
                        Скрыта
                      </span>
                    )}
                  </div>
                  <p className="font-body text-sm text-brand-muted">
                    {fabric.price.toLocaleString("ru-RU")} {fabric.currency} /{" "}
                    {fabric.priceUnit}
                    {" · "}
                    {fabric.colors.length} расцветок
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(fabric)}
                    className="p-2 hover:bg-brand-cream rounded transition-colors"
                    title="Редактировать"
                  >
                    <Edit2 size={16} className="text-brand-muted" />
                  </button>
                  <button
                    onClick={() => handleDelete(fabric._id)}
                    className="p-2 hover:bg-red-50 rounded transition-colors"
                    title="Удалить"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                  <button
                    onClick={() =>
                      setExpanded(expanded === fabric._id ? null : fabric._id)
                    }
                    className="p-2 hover:bg-brand-cream rounded transition-colors"
                    title="Расцветки"
                  >
                    {expanded === fabric._id ? (
                      <ChevronUp size={16} className="text-brand-muted" />
                    ) : (
                      <ChevronDown size={16} className="text-brand-muted" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded: colors panel */}
              {expanded === fabric._id && (
                <div className="border-t border-brand-cream px-5 pb-6 pt-4">
                  <p className="font-body text-xs tracking-[0.25em] uppercase text-brand-muted mb-4">
                    Расцветки ({fabric.colors.length})
                  </p>

                  <div className="flex flex-wrap gap-3 mb-5">
                    {fabric.colors.map((c) => {
                      const editKey = `${fabric._id}__${c._id}`;
                      const isEditing = editingColorId === editKey;

                      return (
                        <div key={c._id} className="relative group">
                          {isEditing ? (
                            /* ── Edit color inline form ── */
                            <form
                              onSubmit={(e) =>
                                handleSaveColor(e, fabric._id, c._id)
                              }
                              className="bg-brand-cream border border-brand-light p-4 w-72"
                            >
                              <p className="font-body text-xs tracking-[0.2em] uppercase text-brand-muted mb-3">
                                Редактировать расцветку
                              </p>
                              <div className="space-y-3 mb-3">
                                <div>
                                  <label className="block font-body text-xs tracking-[0.15em] uppercase text-brand-muted mb-1">
                                    Артикул
                                  </label>
                                  <input
                                    type="text"
                                    value={editColorForm.article}
                                    onChange={(e) =>
                                      setEditColorForm((p) => ({
                                        ...p,
                                        article: e.target.value,
                                      }))
                                    }
                                    className="w-full border border-brand-light bg-white px-3 py-2 font-body text-sm focus:outline-none focus:border-brand-primary"
                                  />
                                </div>
                                <div>
                                  <label className="block font-body text-xs tracking-[0.15em] uppercase text-brand-muted mb-1">
                                    Название
                                  </label>
                                  <input
                                    type="text"
                                    value={editColorForm.name}
                                    onChange={(e) =>
                                      setEditColorForm((p) => ({
                                        ...p,
                                        name: e.target.value,
                                      }))
                                    }
                                    className="w-full border border-brand-light bg-white px-3 py-2 font-body text-sm focus:outline-none focus:border-brand-primary"
                                  />
                                </div>
                                <div>
                                  <label className="block font-body text-xs tracking-[0.15em] uppercase text-brand-muted mb-1">
                                    Фото (необязательно)
                                  </label>
                                  {editColorPreview && (
                                    <img
                                      src={editColorPreview}
                                      alt="preview"
                                      className="w-20 h-20 object-cover border border-brand-light mb-2"
                                    />
                                  )}
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <div className="px-3 py-1.5 border border-brand-primary text-brand-primary font-body text-xs hover:bg-brand-primary hover:text-white transition-colors">
                                      Сменить фото
                                    </div>
                                    <input
                                      type="file"
                                      accept="image/jpeg,image/png,image/webp"
                                      onChange={(e) => {
                                        const f = e.target.files?.[0] || null;
                                        setEditColorFile(f);
                                        if (f)
                                          setEditColorPreview(
                                            URL.createObjectURL(f)
                                          );
                                      }}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="submit"
                                  disabled={savingColor}
                                  className="flex-1 bg-brand-primary text-white font-body text-xs tracking-wider py-2 hover:bg-brand-dark transition-colors disabled:opacity-60"
                                >
                                  {savingColor ? "Сохранение..." : "Сохранить"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingColorId(null)}
                                  className="px-3 py-2 border border-brand-light text-brand-muted font-body text-xs hover:bg-white transition-colors"
                                >
                                  Отмена
                                </button>
                              </div>
                            </form>
                          ) : (
                            /* ── Color card ── */
                            <div className="w-24">
                              <div className="w-24 h-24 overflow-hidden bg-brand-cream border border-brand-light relative">
                                {c.imageUrl ? (
                                  <img
                                    src={c.imageUrl}
                                    alt={c.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Image
                                      size={16}
                                      className="text-brand-muted"
                                    />
                                  </div>
                                )}
                                {/* Action buttons on hover */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                  <button
                                    onClick={() =>
                                      openEditColor(
                                        fabric._id,
                                        c._id,
                                        c.article,
                                        c.name,
                                        c.imageUrl
                                      )
                                    }
                                    className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:bg-brand-cream transition-colors"
                                    title="Редактировать"
                                  >
                                    <Edit2
                                      size={12}
                                      className="text-brand-dark"
                                    />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteColor(fabric._id, c._id)
                                    }
                                    className="w-7 h-7 bg-red-400 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                                    title="Удалить"
                                  >
                                    <Trash2 size={12} className="text-white" />
                                  </button>
                                </div>
                              </div>
                              <div className="mt-1.5">
                                <p className="font-body text-[10px] text-brand-primary font-medium truncate">
                                  Арт. {c.article}
                                </p>
                                <p className="font-body text-xs text-brand-muted truncate">
                                  {c.name}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Add color trigger */}
                    <button
                      onClick={() => {
                        setColorFabricId(
                          colorFabricId === fabric._id ? null : fabric._id
                        );
                        setColorForm({ article: "", name: "" });
                        setColorFile(null);
                        setColorPreview(null);
                        setEditingColorId(null);
                      }}
                      className="w-24 h-24 border-2 border-dashed border-brand-light hover:border-brand-primary flex flex-col items-center justify-center gap-1 transition-colors group"
                    >
                      <Plus
                        size={20}
                        className="text-brand-muted group-hover:text-brand-primary transition-colors"
                      />
                      <span className="font-body text-[10px] text-brand-muted group-hover:text-brand-primary">
                        Добавить
                      </span>
                    </button>
                  </div>

                  {/* Add color inline form */}
                  {colorFabricId === fabric._id && (
                    <form
                      onSubmit={handleAddColor}
                      className="bg-brand-cream p-5 border border-brand-light"
                    >
                      <p className="font-body text-xs tracking-[0.2em] uppercase text-brand-muted mb-4">
                        Новая расцветка
                      </p>
                      <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block font-body text-xs tracking-[0.15em] uppercase text-brand-muted mb-1">
                            Артикул *
                          </label>
                          <input
                            type="text"
                            required
                            value={colorForm.article}
                            onChange={(e) =>
                              setColorForm((p) => ({
                                ...p,
                                article: e.target.value,
                              }))
                            }
                            placeholder="UZH-001"
                            className="w-full border border-brand-light bg-white px-3 py-2 font-body text-sm focus:outline-none focus:border-brand-primary"
                          />
                        </div>
                        <div>
                          <label className="block font-body text-xs tracking-[0.15em] uppercase text-brand-muted mb-1">
                            Название расцветки *
                          </label>
                          <input
                            type="text"
                            required
                            value={colorForm.name}
                            onChange={(e) =>
                              setColorForm((p) => ({
                                ...p,
                                name: e.target.value,
                              }))
                            }
                            placeholder="Голубой"
                            className="w-full border border-brand-light bg-white px-3 py-2 font-body text-sm focus:outline-none focus:border-brand-primary"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block font-body text-xs tracking-[0.15em] uppercase text-brand-muted mb-2">
                          Фотография (необязательно)
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <div className="px-4 py-2 border border-brand-primary text-brand-primary font-body text-xs tracking-wider hover:bg-brand-primary hover:text-white transition-colors">
                            Выбрать файл
                          </div>
                          <span className="font-body text-sm text-brand-muted">
                            {colorFile ? colorFile.name : "Файл не выбран"}
                          </span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleColorFileChange}
                            className="hidden"
                          />
                        </label>
                        {colorPreview && (
                          <img
                            src={colorPreview}
                            alt="preview"
                            className="mt-3 w-32 h-32 object-cover border border-brand-light"
                          />
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={addingColor}
                          className="bg-brand-primary text-white px-6 py-2.5 font-body text-sm tracking-wider hover:bg-brand-dark transition-colors disabled:opacity-60"
                        >
                          {addingColor ? "Загрузка..." : "Добавить расцветку"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setColorFabricId(null)}
                          className="px-4 py-2.5 border border-brand-light text-brand-muted font-body text-sm hover:bg-white transition-colors"
                        >
                          Отмена
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
