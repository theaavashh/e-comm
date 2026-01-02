'use client';

import { useState, useEffect } from 'react';
import {
    Save,
    AlertCircle,
    RotateCcw,
    Plus,
    Trash2,
    Edit,
    GripVertical,
    ChevronRight,
    ChevronDown,
    Layout,
    Link as LinkIcon,
    X,
    ArrowLeft,
    Settings
} from 'lucide-react';
import axios from 'axios';
import { getApiBaseUrl } from '@/utils/api';
import toast from 'react-hot-toast';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Types ---
interface NavigationItem {
    id: string;
    label: string;
    href: string;
    type: 'link' | 'dropdown';
    columns?: NavColumn[];
}

interface NavColumn {
    title: string;
    groups?: NavGroup[]; // Optional: Some columns might use direct items? Based on checkNavigation.ts, 'TEA' has items directly
    items?: NavLink[];   // Optional: For columns without groups
}

interface NavGroup {
    title: string;
    items: NavLink[];
}

interface NavLink {
    label: string;
    href: string;
}

interface Category {
    id: string;
    name: string;
}

// --- Helper Components ---

function CategoryPicker({
    value,
    onChange,
    categories
}: {
    value: string,
    onChange: (catId: string, label: string) => void,
    categories: Category[]
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Category</label>
            <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={value}
                onChange={(e) => {
                    const idx = e.target.selectedIndex;
                    const label = e.target.options[idx].text;
                    onChange(e.target.value, label);
                }}
            >
                <option value="">-- Choose a category --</option>
                {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
        </div>
    );
}

function UrlInput({
    value,
    onChange
}: {
    value: string,
    onChange: (val: string) => void
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Path</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="/products/example"
            />
        </div>
    );
}

// --- Mega Menu Editor Components ---

function MegaMenuEditor({
    columns,
    onChange,
    categories
}: {
    columns: NavColumn[],
    onChange: (cols: NavColumn[]) => void,
    categories: Category[]
}) {
    const [activeColumnIndex, setActiveColumnIndex] = useState<number | null>(null);

    const addColumn = () => {
        onChange([...columns, { title: 'New Column', items: [] }]);
    };

    const updateColumn = (index: number, newCol: NavColumn) => {
        const newCols = [...columns];
        newCols[index] = newCol;
        onChange(newCols);
    };

    const removeColumn = (index: number) => {
        if (confirm('Delete this column?')) {
            const newCols = [...columns];
            newCols.splice(index, 1);
            onChange(newCols);
        }
    };

    if (activeColumnIndex !== null && columns[activeColumnIndex]) {
        return (
            <ColumnEditor
                column={columns[activeColumnIndex]}
                onChange={(newCol) => updateColumn(activeColumnIndex, newCol)}
                onBack={() => setActiveColumnIndex(null)}
                categories={categories}
            />
        );
    }

    return (
        <div className="space-y-3 mt-4 border-t pt-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Layout className="w-4 h-4" />
                Step 2: Mega Menu Columns
            </h3>
            <p className="text-sm text-gray-500 mb-2">Define the columns that appear in the dropdown.</p>

            <div className="space-y-2">
                {columns.map((col, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="font-medium">{col.title || '(Untitled Column)'}</span>
                        <div className="flex gap-2">
                            <button onClick={() => setActiveColumnIndex(idx)} className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1">
                                Edit Content
                            </button>
                            <button onClick={() => removeColumn(idx)} className="text-red-500 hover:text-red-700 p-1">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={addColumn} className="w-full py-2 border border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center justify-center text-sm font-medium">
                <Plus className="w-4 h-4 mr-2" />
                Add Column
            </button>
        </div>
    );
}

function ColumnEditor({
    column,
    onChange,
    onBack,
    categories
}: {
    column: NavColumn,
    onChange: (col: NavColumn) => void,
    onBack: () => void,
    categories: Category[]
}) {
    // Determine mode: Groups or Direct Items
    const hasGroups = !!column.groups && column.groups.length > 0;
    const hasItems = !!column.items && column.items.length > 0;
    // Default to items if empty, or groups if explicitly set
    const mode = hasGroups ? 'groups' : 'items';

    const [viewMode, setViewMode] = useState<'groups' | 'items'>(mode);
    const [editingGroupIndex, setEditingGroupIndex] = useState<number | null>(null);

    const toggleMode = (m: 'groups' | 'items') => {
        if (m === viewMode) return;
        if ((m === 'groups' && hasItems) || (m === 'items' && hasGroups)) {
            if (!confirm('Switching structure will clear existing items/groups in this column. Continue?')) return;
        }
        setViewMode(m);
        // Reset data for the other mode
        if (m === 'groups') onChange({ ...column, items: undefined, groups: [] });
        else onChange({ ...column, groups: undefined, items: [] });
    };

    const updateTitle = (t: string) => onChange({ ...column, title: t });

    // -- Group Management --
    const addGroup = () => {
        const newGroups = [...(column.groups || [])];
        newGroups.push({ title: 'New Group', items: [] });
        onChange({ ...column, groups: newGroups });
    };

    const updateGroup = (idx: number, grp: NavGroup) => {
        const newGroups = [...(column.groups || [])];
        newGroups[idx] = grp;
        onChange({ ...column, groups: newGroups });
    };

    const removeGroup = (idx: number) => {
        const newGroups = [...(column.groups || [])];
        newGroups.splice(idx, 1);
        onChange({ ...column, groups: newGroups });
    };

    // -- Item Management (Direct) --
    const addItem = (item: NavLink) => {
        const newItems = [...(column.items || [])];
        newItems.push(item);
        onChange({ ...column, items: newItems });
    };

    const removeItem = (idx: number) => {
        const newItems = [...(column.items || [])];
        newItems.splice(idx, 1);
        onChange({ ...column, items: newItems });
    };

    if (editingGroupIndex !== null && column.groups?.[editingGroupIndex]) {
        return (
            <GroupEditor
                group={column.groups[editingGroupIndex]}
                onChange={(g) => updateGroup(editingGroupIndex, g)}
                onBack={() => setEditingGroupIndex(null)}
                categories={categories}
            />
        );
    }

    return (
        <div className="space-y-4">
            <button onClick={onBack} className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-2">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Columns
            </button>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Column Title</label>
                <input
                    type="text"
                    value={column.title}
                    onChange={e => updateTitle(e.target.value)}
                    className="w-full border p-2 rounded-lg"
                    placeholder="e.g., Achar, Tea"
                />
            </div>

            <div className="flex gap-4 border-b border-gray-200">
                <button
                    onClick={() => toggleMode('items')}
                    className={`pb-2 text-sm font-medium px-2 ${viewMode === 'items' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                >
                    Direct Links
                </button>
                <button
                    onClick={() => toggleMode('groups')}
                    className={`pb-2 text-sm font-medium px-2 ${viewMode === 'groups' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                >
                    Grouped Links
                </button>
            </div>

            {viewMode === 'groups' ? (
                <div className="space-y-3">
                    {column.groups?.map((grp, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-sm">{grp.title}</span>
                            <div className="flex gap-2">
                                <button onClick={() => setEditingGroupIndex(idx)} className="text-blue-600 text-xs font-bold px-2 py-1">Edit</button>
                                <button onClick={() => removeGroup(idx)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                    <button onClick={addGroup} className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium text-center">
                        + Add Group
                    </button>
                </div>
            ) : (
                <ItemsList items={column.items || []} onChange={(items) => onChange({ ...column, items })} categories={categories} />
            )}
        </div>
    );
}

function GroupEditor({
    group,
    onChange,
    onBack,
    categories
}: {
    group: NavGroup,
    onChange: (g: NavGroup) => void,
    onBack: () => void,
    categories: Category[]
}) {
    return (
        <div className="space-y-4">
            <button onClick={onBack} className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-2">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Column
            </button>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Title</label>
                <input
                    type="text"
                    value={group.title}
                    onChange={e => onChange({ ...group, title: e.target.value })}
                    className="w-full border p-2 rounded-lg"
                    placeholder="e.g., Veg, Non-Veg"
                />
            </div>

            <div className="border-t pt-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Links in this Group</h4>
                <ItemsList items={group.items} onChange={(items) => onChange({ ...group, items })} categories={categories} />
            </div>
        </div>
    );
}

function ItemsList({
    items,
    onChange,
    categories
}: {
    items: NavLink[],
    onChange: (items: NavLink[]) => void,
    categories: Category[]
}) {
    const [adding, setAdding] = useState(false);
    const [newItem, setNewItem] = useState({ label: '', href: '', source: 'category', catId: '' });

    const handleAdd = () => {
        let href = newItem.href;
        let label = newItem.label;

        if (newItem.source === 'category') {
            const cat = categories.find(c => c.id === newItem.catId);
            if (cat) {
                href = `/products/${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                if (!label) label = cat.name;
            }
        }

        if (!label) return toast.error('Label required');

        onChange([...items, { label, href }]);
        setAdding(false);
        setNewItem({ label: '', href: '', source: 'category', catId: '' });
    };

    const remove = (idx: number) => {
        const n = [...items];
        n.splice(idx, 1);
        onChange(n);
    };

    return (
        <div className="space-y-2">
            {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white border p-2 rounded text-sm">
                    <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-gray-400 text-xs">{item.href}</div>
                    </div>
                    <button onClick={() => remove(idx)} className="text-red-500"><X className="w-4 h-4" /></button>
                </div>
            ))}

            {adding ? (
                <div className="bg-gray-50 p-3 rounded-lg space-y-3 border border-blue-200">
                    <div className="flex gap-2 text-xs">
                        <button onClick={() => setNewItem({ ...newItem, source: 'category' })} className={`px-2 py-1 rounded ${newItem.source === 'category' ? 'bg-white shadow' : ''}`}>Category</button>
                        <button onClick={() => setNewItem({ ...newItem, source: 'custom' })} className={`px-2 py-1 rounded ${newItem.source === 'custom' ? 'bg-white shadow' : ''}`}>Custom</button>
                    </div>

                    {newItem.source === 'category' ? (
                        <CategoryPicker
                            value={newItem.catId}
                            onChange={(id, label) => setNewItem({ ...newItem, catId: id, label: newItem.label || label })}
                            categories={categories}
                        />
                    ) : (
                        <UrlInput value={newItem.href} onChange={v => setNewItem({ ...newItem, href: v })} />
                    )}

                    <div>
                        <input
                            placeholder="Label"
                            className="w-full border p-2 rounded text-sm"
                            value={newItem.label}
                            onChange={e => setNewItem({ ...newItem, label: e.target.value })}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleAdd} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Add</button>
                        <button onClick={() => setAdding(false)} className="text-gray-500 px-3 py-1 text-sm">Cancel</button>
                    </div>
                </div>
            ) : (
                <button onClick={() => setAdding(true)} className="text-sm text-blue-600 hover:underline flex items-center">
                    <Plus className="w-3 h-3 mr-1" /> Add Link
                </button>
            )}
        </div>
    );
}


// --- Main Page Component ---
// Sortable Item Component
function SortableItem({ item, onEdit, onDelete }: { item: NavigationItem, onEdit: () => void, onDelete: () => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="bg-white border border-gray-200 rounded-lg p-3 mb-2 flex items-center shadow-sm">
            <div {...attributes} {...listeners} className="cursor-grab mr-3 text-gray-400 hover:text-gray-600">
                <GripVertical className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    {item.type === 'dropdown' ? <Layout className="w-4 h-4 text-blue-500" /> : <LinkIcon className="w-4 h-4 text-gray-500" />}
                    <span className="font-semibold text-gray-900">{item.label}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate max-w-[300px]">{item.href}</p>
            </div>
            <div className="flex gap-2">
                <button onClick={onEdit} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                </button>
                <button onClick={onDelete} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default function NavigationPage() {
    const [items, setItems] = useState<NavigationItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        label: '',
        type: 'link' as 'link' | 'dropdown',
        linkSource: 'category' as 'category' | 'custom',
        selectedCategory: '',
        customUrl: '',
        id: '',
        columns: [] as NavColumn[]
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [navRes, catRes] = await Promise.all([
                axios.get(`${getApiBaseUrl()}/api/v1/configuration/public/navigation`),
                axios.get(`${getApiBaseUrl()}/api/v1/categories`)
            ]);

            if (navRes.data.success) {
                setItems(navRes.data.data || []);
            }
            if (catRes.data.success) {
                const flatCats: Category[] = [];
                const traverse = (cats: any[]) => {
                    cats.forEach(c => {
                        flatCats.push({ id: c.id, name: c.name });
                        if (c.children) traverse(c.children);
                    });
                };
                traverse(catRes.data.data.categories);
                setCategories(flatCats);
            }
        } catch (err) {
            toast.error('Failed to load data');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const openModal = (item?: NavigationItem) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                label: item.label,
                type: item.type,
                linkSource: 'custom',
                selectedCategory: '',
                customUrl: item.href,
                id: item.id,
                columns: item.columns || []
            });

            const matchedCat = categories.find(c => item.href.includes(c.id) || item.href.endsWith(c.name.toLowerCase().replace(/ /g, '-')));
            if (matchedCat) {
                setFormData(prev => ({ ...prev, linkSource: 'category', selectedCategory: matchedCat.id }));
            }
        } else {
            setEditingItem(null);
            setFormData({
                label: '',
                type: 'link',
                linkSource: 'category',
                selectedCategory: '',
                customUrl: '',
                id: `nav-${Date.now()}`,
                columns: []
            });
        }
        setShowModal(true);
    };

    const handleSaveItem = () => {
        let href = formData.customUrl;
        let label = formData.label;

        if (formData.linkSource === 'category') {
            const cat = categories.find(c => c.id === formData.selectedCategory);
            if (cat) {
                href = `/products/${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                if (!label) label = cat.name;
            }
        }

        if (!label) {
            toast.error('Label is required');
            return;
        }

        const newItem: NavigationItem = {
            id: editingItem ? editingItem.id : formData.id,
            label,
            href,
            type: formData.type,
            columns: formData.type === 'dropdown' ? formData.columns : undefined
        };

        if (editingItem) {
            setItems(items.map(i => i.id === editingItem.id ? newItem : i));
        } else {
            setItems([...items, newItem]);
        }
        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this navigation item?')) {
            setItems(items.filter(i => i.id !== id));
        }
    };

    const handleSaveAll = async () => {
        try {
            setIsSaving(true);
            await axios.put(
                `${getApiBaseUrl()}/api/v1/configuration/navigation`,
                { navigation: items },
                { withCredentials: true }
            );
            toast.success('Navigation saved successfully');
        } catch (err) {
            toast.error('Failed to save navigation');
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 custom-font">Navigation Management</h1>
                    <p className="text-gray-600 mt-1 custom-font">Drag to reorder, click edit to manage dropdown content</p>
                </div>
                <button
                    onClick={handleSaveAll}
                    disabled={isSaving}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold disabled:opacity-50"
                >
                    {isSaving ? <RotateCcw className="animate-spin mr-2" /> : <Save className="mr-2 w-4 h-4" />}
                    Save Changes
                </button>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={items.map(i => i.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {items.map((item) => (
                            <SortableItem
                                key={item.id}
                                item={item}
                                onEdit={() => openModal(item)}
                                onDelete={() => handleDelete(item.id)}
                            />
                        ))}
                    </SortableContext>
                </DndContext>

                <button
                    onClick={() => openModal()}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center font-medium mt-4"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Navigation Item
                </button>
            </div>

            {/* Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{editingItem ? 'Edit Item' : 'New Item'}</h2>
                            <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Item Type</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="type"
                                            checked={formData.type === 'link'}
                                            onChange={() => setFormData({ ...formData, type: 'link' })}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span>Simple Link</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="type"
                                            checked={formData.type === 'dropdown'}
                                            onChange={() => setFormData({ ...formData, type: 'dropdown' })}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span>Mega Menu (Dropdown)</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Main Link Source</label>
                                <div className="flex gap-4 p-1 bg-gray-100 rounded-lg inline-flex">
                                    <button
                                        onClick={() => setFormData({ ...formData, linkSource: 'category' })}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${formData.linkSource === 'category' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-black'}`}
                                    >
                                        Category
                                    </button>
                                    <button
                                        onClick={() => setFormData({ ...formData, linkSource: 'custom' })}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${formData.linkSource === 'custom' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-black'}`}
                                    >
                                        Custom URL
                                    </button>
                                </div>
                            </div>

                            {formData.linkSource === 'category' ? (
                                <CategoryPicker
                                    value={formData.selectedCategory}
                                    onChange={(id, label) => setFormData({ ...formData, selectedCategory: id, label: formData.label || label })}
                                    categories={categories}
                                />
                            ) : (
                                <UrlInput value={formData.customUrl} onChange={v => setFormData({ ...formData, customUrl: v })} />
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                                <input
                                    type="text"
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Menu Label"
                                />
                            </div>

                            {/* Mega Menu Editor */}
                            {formData.type === 'dropdown' && (
                                <MegaMenuEditor
                                    columns={formData.columns}
                                    onChange={(cols) => setFormData({ ...formData, columns: cols })}
                                    categories={categories}
                                />
                            )}

                            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveItem}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                                >
                                    {editingItem ? 'Save Changes' : 'Create Item'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
