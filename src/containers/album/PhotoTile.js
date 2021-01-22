import { Checkbox, Typography } from "antd";

const { Paragraph } = Typography;

function PhotoTile({
  doc,
  handleCheckImage,
  checkedImage,
  handleCheckImageDiv,
  isCheckboxesShown,
}) {
  return (
    <div
      className={`image-tile-card ${
        isCheckboxesShown && !checkedImage.includes(doc.id)
          ? "less-opacity"
          : ""
      }`}
    >
      <Checkbox
        className={`image-tile-checkbox ${
          !checkedImage.includes(doc.id) ? "hidden" : ""
        }`}
        onChange={handleCheckImage}
        name={doc.id}
        id={JSON.stringify(doc)}
        checked={checkedImage.includes(doc.id)}
      ></Checkbox>
      <div
        id={doc.id}
        className="image-tile-wrapper"
        onClick={handleCheckImageDiv}
      >
        <img
          src={doc.raw}
          alt={doc.name}
          name={doc.id}
          id={JSON.stringify(doc)}
        />
      </div>
      <div className="image-tile-details">
        <Paragraph ellipsis className="tile-name" title={doc.name}>
          {doc.name}
        </Paragraph>
        <Paragraph ellipsis className="tile-album">
          {(doc.album || "").toUpperCase() || "ALBUM NAME"}
        </Paragraph>
      </div>
    </div>
  );
}

export default PhotoTile;
