import { Col, Row, Upload, message, Select, Form, Button } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useState } from "react";

import { StyledLayout } from "./styled/layout";
import StyledModal from "./styled/modal";
import { uploadPhotos } from "../utils/API";

const { Dragger } = Upload;
const { Option } = Select;

function ModalUpload({ visible = false, setVisible, setFilters, setAppend }) {
  const [form] = Form.useForm();

  const [errorFiles, setErrorFiles] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [isAlbumEmpty, setIsAlbumEmpty] = useState(false);

  const props = {
    name: "file",
    listType: "picture-card",
    accept:
      "image/png, image/jpeg, image/webp, image/gif, image/tiff, image/svg+xml",
    multiple: true,
    onChange(info) {
      const { status, uid } = info.file;

      if (status === "error") {
        setErrorFiles((prevErrorFiles) => [...prevErrorFiles, uid]);
        message.error(`${info.file.name} is not an image.`);
      }
    },
    onRemove(file) {
      const { status, uid } = file;
      if (status === "error") {
        setErrorFiles((prevErrorFiles) => {
          const index = prevErrorFiles.indexOf(uid);
          const newErrorFiles = prevErrorFiles.slice();
          newErrorFiles.splice(index, 1);
          return newErrorFiles;
        });
        return;
      }
      setFileList((prevFileList) => {
        const index = prevFileList.indexOf(uid);
        const newFileList = prevFileList.slice();
        newFileList.splice(index, 1);
        return newFileList;
      });
    },
    customRequest({ file, onSuccess, onError }) {
      setTimeout(() => {
        let fileTypes = [
          "image/png",
          "image/jpeg",
          "image/webp",
          "image/svg+xml",
          "image/tiff",
          "image/gif",
        ];
        if (!fileTypes.includes(file.type)) {
          return onError();
        }
        setFileList((prevFileList) => [...prevFileList, file.uid]);
        return onSuccess();
      }, 0);
    },
  };

  const onFinish = (values) => {
    console.log(values);
    const { file: files, album } = values;
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("documents", file.originFileObj);
    });
    formData.append("album", album);

    setVisible(false);
    uploadPhotos({ formData })
      .then((res) => {
        message.success(`Files successfully uploaded.`);
        setAppend(false);
        setFilters((prevFilters) => ({
          ...prevFilters,
          skip: 0,
        }));
        form.resetFields();
      })
      .catch((err) => {
        const { data = {} } = err;
        message.error(data.message || "Something went wrong!");
      });
  };

  const normFile = (e) => {
    if (e.file.status !== "error") {
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    }
  };

  return (
    <Form form={form} name="upload-form" onFinish={onFinish} id="upload-form">
      <StyledModal
        visible={visible}
        title="Upload photos"
        onCancel={(prevVisible) => setVisible(!prevVisible)}
        footer={[
          <StyledLayout>
            <Row>
              <Col>
                <Form.Item name="album">
                  <Select
                    placeholder="Select album"
                    onChange={() => setIsAlbumEmpty(false)}
                  >
                    <Option value="Travel">Travel</Option>
                    <Option value="Personal">Personal</Option>
                    <Option value="Food">Food</Option>
                    <Option value="Nature">Nature</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    form="upload-form"
                    key="submit"
                    disabled={
                      (fileList.length === 0 && errorFiles.length === 0) ||
                      (fileList.length > 0 && errorFiles.length > 0) ||
                      (fileList.length === 0 && errorFiles.length > 0) ||
                      isAlbumEmpty
                    }
                  >
                    Upload
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </StyledLayout>,
        ]}
      >
        <Form.Item
          name="file"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">Only images will be accepted</p>
          </Dragger>
        </Form.Item>
      </StyledModal>
    </Form>
  );
}

export default ModalUpload;
