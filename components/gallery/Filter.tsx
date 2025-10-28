import React from "react";
import { Input } from "../ui/input";
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
};

const FilterGallery = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
}: IProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4 gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder=" Tìm kiếm ảnh theo tiêu đề..."
            className=""
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sắp xếp</SelectLabel>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="oldest"> Cũ nhất</SelectItem>
              <SelectItem value="title-asc"> Tiêu đề A-Z</SelectItem>
              <SelectItem value="title-desc"> Tiêu đề Z-A</SelectItem>
              <SelectItem value="album-asc"> Album ↑</SelectItem>
              <SelectItem value="album-desc"> Album ↓</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default FilterGallery;
