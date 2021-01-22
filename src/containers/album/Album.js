import { Button, Divider, Row, Select, Modal, message } from "antd";
import { Fragment, useEffect, useState } from "react";
import {
  LoadingOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import ModalUpload from "../../components/ModalUpload";
import { StyledLayout } from "../../components/styled/layout";
import { deletePhotos, getPhotosList } from "../../utils/API";
import PhotoTile from "./PhotoTile";

const { Option } = Select;
const { confirm } = Modal;

function Album() {
  const [filters, setFilters] = useState({
    skip: 0,
    limit: 25,
  });
  const [data, setData] = useState({
    count: 0,
    documents: [],
    isLoading: false,
  });

  const [append, setAppend] = useState(true);
  const [checkedImage, setCheckedImage] = useState([]);
  const [checkedImageData, setCheckedImageData] = useState([]);
  const [isModalShown, setIsModalShown] = useState(false);
  const [isCheckboxesShown, setIsCheckboxesShown] = useState(false);

  function handleToggleUpload() {
    setIsModalShown(!isModalShown);
  }

  function handleLoadMore() {
    setAppend(true);
    setFilters((prevFilters) => ({
      ...prevFilters,
      skip: prevFilters.skip + prevFilters.limit,
    }));
  }

  function handleFilterChange(value) {
    setAppend(false);

    setFilters((prevFilters) => ({
      ...prevFilters,
      limit: value,
      skip: 0,
    }));
  }

  function handleClearSelection() {
    setCheckedImage([]);
    setCheckedImageData([]);
    setIsCheckboxesShown(false);
  }

  function handleCheckImage(e) {
    const { name, checked, id } = e.target;
    if (checked) {
      setCheckedImage((prevChecked) => [...prevChecked, name]);
      setCheckedImageData((prevCheckedData) => [...prevCheckedData, id]);
    } else {
      setCheckedImage((prevChecked) => prevChecked.filter((c) => c !== name));
      setCheckedImageData((prevCheckedData) =>
        prevCheckedData.filter((c) => c !== id)
      );
    }
  }

  function handleCheckImageDiv(e) {
    const { name, id } = e.target;
    if (!checkedImage.includes(name)) {
      setCheckedImage((prevChecked) => [...prevChecked, name]);
      setCheckedImageData((prevCheckedData) => [...prevCheckedData, id]);
    } else {
      setCheckedImage((prevChecked) => prevChecked.filter((c) => c !== name));
      setCheckedImageData((prevCheckedData) =>
        prevCheckedData.filter((c) => c !== id)
      );
    }
  }

  function showConfirmDelete() {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to delete these photos?",
      onOk() {
        handleDeletePhotos();
      },
    });
  }

  function handleDeletePhotos() {
    let checkedData = checkedImageData.map((c) => {
      const parsedData = JSON.parse(c);
      return {
        album: parsedData.album,
        name: parsedData.name,
      };
    });

    let body = checkedData.reduce(function (acc, curr) {
      let findIndex = acc.findIndex(function (item) {
        return item.album === curr.album;
      });

      if (findIndex === -1) {
        acc.push({ album: curr.album, documents: curr.name });
      } else {
        acc[findIndex] = {
          album: acc[findIndex].album,
          documents: acc[findIndex].documents.concat(`, ${curr.name}`),
        };
      }

      return acc;
    }, []);

    deletePhotos({ body })
      .then(() => {
        message.success(`Files successfully deleted.`);
        setFilters((prevFilters) => ({
          ...prevFilters,
          skip: 0,
        }));
        handleClearSelection();
        setAppend(false);
      })
      .catch((err) => {
        const { data = {} } = err;
        message.error(data.message || "Something went wrong!");
      });
  }

  useEffect(() => {
    const { skip, limit } = filters;

    let mounted = true;

    setData((prevData) => ({ ...prevData, isLoading: true }));

    getPhotosList({ skip, limit })
      .then((res) => {
        const { count, documents } = res;
        if (mounted) {
          setData((prevData, curData) => ({
            count,
            documents: append
              ? [...prevData.documents, ...documents]
              : documents,
            isLoading: false,
          }));
        }
      })
      .catch((err) => {
        const { data = {} } = err;
        message.error(data.message || "Something went wrong!");
        setData((prevData) => ({ ...prevData, isLoading: false }));
      });

    return () => (mounted = false);
  }, [append, filters]);

  useEffect(() => {
    setIsCheckboxesShown(checkedImage.length > 0);
  }, [checkedImage]);

  return (
    <div className="body-wrapper">
      <ModalUpload
        visible={isModalShown}
        setVisible={setIsModalShown}
        setFilters={setFilters}
        setAppend={setAppend}
      />
      <nav className="nav-header">
        <div className="nav-title">
          <h1>Photos</h1>
        </div>
        <div className="nav-controls">
          {isCheckboxesShown && checkedImage.length > 0 && (
            <Fragment>
              <div>
                <Button onClick={handleClearSelection} type="text">
                  Clear Selection
                </Button>
              </div>
              <Divider type="vertical" />
              <div>
                <Button onClick={showConfirmDelete} type="text">
                  <DeleteOutlined /> Delete {checkedImage.length} photos
                </Button>
              </div>
              <Divider type="vertical" />
            </Fragment>
          )}
          <div>
            <Button onClick={handleToggleUpload} type="text">
              <CloudUploadOutlined /> Upload
            </Button>
          </div>
          <Divider type="vertical" />
          <div>
            <Select
              bordered={false}
              defaultValue={filters.limit}
              onChange={handleFilterChange}
            >
              <Option value={5}>5</Option>
              <Option value={10}>10</Option>
              <Option value={25}>25</Option>
              <Option value={50}>50</Option>
              <Option value={100}>100</Option>
              <Option value={250}>250</Option>
              <Option value={500}>500</Option>
            </Select>
          </div>
        </div>
      </nav>
      <StyledLayout className="gallery">
        {(data.documents || []).length > 0 ? (
          <Fragment>
            <Row type="flex" className="gallery-row">
              {(data.documents || []).map((doc, idx) => (
                <PhotoTile
                  key={`photo-tile-${idx}`}
                  doc={doc}
                  checkedImage={checkedImage}
                  isCheckboxesShown={isCheckboxesShown}
                  handleCheckImage={handleCheckImage}
                  handleCheckImageDiv={handleCheckImageDiv}
                />
              ))}
            </Row>
            {data.count ? (
              <Button
                type="text"
                className="load-more-btn"
                onClick={handleLoadMore}
              >
                {data.isLoading ? <LoadingOutlined /> : "Load more"}
              </Button>
            ) : (
              <div className="end-msg">You've reached the end.</div>
            )}
          </Fragment>
        ) : data.isLoading ? (
          <div className="no-photos">Fetching photos...</div>
        ) : (
          <div className="no-photos">No photos found</div>
        )}
      </StyledLayout>
    </div>
  );
}

export default Album;
