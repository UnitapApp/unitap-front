import { ChangeEventHandler } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { FaImage, FaDownload } from "react-icons/fa";

export default function ImageUploader<T extends FieldValues = FieldValues>({
  control,
  name,
}: {
  control: Control<T>;
  name: Path<T>;
}) {
  const {
    field: { onBlur, onChange, value },
  } = useController({
    name,
    control,
  });
  const image = value;

  const handleImageUpload: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!event.target.files) return;

    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result?.toString() ?? null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <label
      className="flex cursor-pointer items-center gap-3"
      htmlFor="imageInput"
    >
      {image ? (
        <img
          src={image}
          alt="Uploaded"
          className="h-10 w-10 rounded-full object-cover"
        />
      ) : (
        <div className="grid place-items-center rounded-full bg-[#F1F5F9] p-2">
          <FaImage size={20} />
        </div>
      )}

      <div className="bg-gray-200 flex items-center gap-2 rounded-md px-4 py-1">
        Upload Logo <FaDownload />
      </div>

      <input
        type="file"
        id="imageInput"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </label>
  );
}
