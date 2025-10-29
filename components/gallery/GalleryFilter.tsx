import { Input } from "../ui/input";
import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type IProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  albums?: IAlbums[];
  selectedAlbum: number | null;
  setSelectedAlbum: (value: number | null) => void;
};

const GalleryFilter = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  albums = [],
  selectedAlbum,
  setSelectedAlbum,
}: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile: Collapsible Filter Button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <Search className="w-4 h-4" />
            Bộ lọc
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isOpen && (
          <div className="mt-2 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2 block">
                Tìm kiếm
              </label>
              <Input
                type="text"
                placeholder="Tiêu đề ảnh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2 block">
                Album
              </label>
              <Select
                value={selectedAlbum !== null ? String(selectedAlbum) : "all"}
                onValueChange={(value) =>
                  setSelectedAlbum(value === "all" ? null : Number(value))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn album" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Tất cả album</SelectItem>
                    {albums.map((album) => (
                      <SelectItem key={album.id} value={String(album.id)}>
                        {album.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2 block">
                Sắp xếp
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="newest">Mới nhất</SelectItem>
                    <SelectItem value="oldest">Cũ nhất</SelectItem>
                    <SelectItem value="title-asc">Tiêu đề A-Z</SelectItem>
                    <SelectItem value="title-desc">Tiêu đề Z-A</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className="hidden md:flex gap-3 mb-6 p-4 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg sticky top-0 z-40 shadow-sm backdrop-blur-sm">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Tìm kiếm ảnh theo tiêu đề..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <Select
          value={selectedAlbum !== null ? String(selectedAlbum) : "all"}
          onValueChange={(value) =>
            setSelectedAlbum(value === "all" ? null : Number(value))
          }
        >
          <SelectTrigger className="w-40 lg:w-48">
            <SelectValue placeholder="Album" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Tất cả album</SelectItem>
              {albums.map((album) => (
                <SelectItem key={album.id} value={String(album.id)}>
                  {album.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40 lg:w-48">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="oldest">Cũ nhất</SelectItem>
              <SelectItem value="title-asc">A-Z</SelectItem>
              <SelectItem value="title-desc">Z-A</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default GalleryFilter;
