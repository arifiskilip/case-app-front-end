import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useForm } from "react-hook-form";
import axiosInstance from "../interceptors/axiosInstance ";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import Swal from "sweetalert2";

const Task = () => {
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [completedTask, setCompletedTask] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskId, setTaskId] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedRegionId, setSelectedRegionId] = useState(null);

  const { register, handleSubmit } = useForm();

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showOperationModal, setShowOperationModal] = useState(false);

  const handleCloseDetailModal = () => setShowDetailModal(false);
  const handleShowDetailModal = async (id) => {
    try {
      const response = await axiosInstance.get(`/CompletedTask/GetById?Id=${id}`);
      setCompletedTask(response.data.items); // Veriyi state'e set et
      console.log(response.data); // Veriyi konsola yazdır
      setShowDetailModal(true); // Modal'ı göster
    } catch (error) {
      console.error("Error fetching completed task:", error); // Hata mesajını konsola yazdır
    }
  };

  const handleCloseOperationModal = () => setShowOperationModal(false);
  const handleShowOperationModal = (id) => {
    setTaskId(id);
    setShowOperationModal(true);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const regionResponse = await axiosInstance.get("/Region/GetAll");
        setRegions(regionResponse.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [pageIndex, pageSize]);

  const fetchTasks = async (filters = {}) => {
    try {
      const response = await axiosInstance.get(
        "/Task/GetAllFilteredPaginated",
        {
          params: {
            ...filters,
            PageIndex: pageIndex,
            PageSize: pageSize,
          },
        }
      );
      setTasks(response.data.items);
      setTotalItems(response.data.pagination.totalItems);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegionChange = async (e) => {
    const regionId = e.target.value;
    setSelectedRegionId(regionId);
    if (regionId) {
      try {
        const response = await axiosInstance.get(
          `/City/GetAllByRegionId?RegionId=${regionId}`
        );
        setCities(response.data);
      } catch (error) {
        console.error(error);
      }
    } else {
      setCities([]);
    }
  };

  const onSubmit = (data) => {
    const filters = {
      CityId: data.city,
      RegionId: data.region,
    };
    fetchTasks(filters);
  };
  const clearFilter = () => {
    setSelectedRegionId(null);
    setCities([]);
    fetchTasks();
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setPageIndex(page);
    }
  };

  const prevPage = () => {
    if (pageIndex > 1) {
      setPageIndex(pageIndex - 1);
    }
  };

  const nextPage = () => {
    if (pageIndex < totalPages) {
      setPageIndex(pageIndex + 1);
    }
  };

  const goToFirstPage = () => {
    setPageIndex(1);
  };

  const goToLastPage = () => {
    setPageIndex(totalPages);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 10;
    const startPage = Math.max(1, pageIndex - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  // Operations
  const operationsSchema = yup.object({
    taskId: yup.number(),
    quantity: yup
      .number()
      .required("Sayısal değer gereklidir")
      .positive("Pozitif bir sayı girin"),
    startDate: yup.date().required("Başlangıç tarihi gereklidir").nullable(),
    endDate: yup
      .date()
      .required("Bitiş tarihi gereklidir")
      .nullable()
      .min(
        yup.ref("startDate"),
        "Bitiş tarihi başlangıç tarihinden önce olamaz"
      ),
  });

  const onOperationSubmit = async (data) => {
    try {
        data.taskId= taskId;
        await axiosInstance.post('/CompletedTask/Add',data);
        handleCloseOperationModal();
        fetchTasks();
    } catch (error) {
        Swal.fire("Hata",error.response.data.detail,"error");
        console.log(error);
    }
  };
  return (
    <div>
      <Navbar />
      <div className="container-fluid p-4 mt-5">
        {/* Filter Section */}
        <div className="row mb-4">
          <div className="col-md-12">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-12 col-md-3 mb-3">
                  <div className="form-group">
                    <label htmlFor="region">Bölge</label>
                    <select
                      id="region"
                      className="form-select"
                      {...register("region")}
                      onChange={handleRegionChange}
                    >
                      <option value="">Seçiniz...</option>
                      {regions.map((region) => (
                        <option key={region.id} value={region.id}>
                          {region.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-12 col-md-3 mb-3">
                  <div className="form-group">
                    <label htmlFor="city">Şehir</label>
                    <select
                      id="city"
                      className="form-select"
                      {...register("city")}
                      disabled={!selectedRegionId}
                    >
                      <option value="">Seçiniz...</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-12 col-md-3 d-flex align-items-end mb-3">
                  <button type="submit" className="btn btn-primary w-100">
                    Ara
                  </button>
                </div>
                <div className="col-12 col-md-3 d-flex align-items-end mb-3">
                  <button
                    type="button"
                    className="btn btn-danger w-100"
                    onClick={clearFilter}
                    disabled={!selectedRegionId}
                  >
                    Temizle
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="row">
          <div className="col-md-12">
            <table className="table table-striped table-bordered table-hover table-sm">
              <thead>
                <tr>
                  <th>İşin Adı</th>
                  <th>Bölgeler</th>
                  <th>Tarama Birimleri</th>
                  <th>Hedeflenen</th>
                  <th>Gerçekleşen</th>
                  <th>Detay Butonu</th>
                  <th>Operasyon Butonu</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.taskName}</td>
                    <td>{task.cityRegionName}</td>
                    <td>{task.unitTypeName}</td>
                    <td>{task.total}</td>
                    <td>{task.performed}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-info btn-sm"
                        onClick={()=> handleShowDetailModal(task.id)}
                      >
                        Detay
                      </button>
                    </td>
                    {task.performed !== task.total && (
                    <td>
                        <button
                        type="button"
                        className="btn btn-warning btn-sm"
                        onClick={() => handleShowOperationModal(task.id)}
                        >
                        Operasyon
                        </button>
                    </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Section */}
        <div className="row">
          <div className="col-md-12 d-flex justify-content-center mt-3">
            <nav aria-label="Page navigation">
              <ul className="pagination">
                <li class="page-item">
                  <button className="page-link" onClick={goToFirstPage}>
                    İlk
                  </button>
                </li>
                <li class="page-item">
                  <button className="page-link" onClick={prevPage}>
                    Önceki
                  </button>
                </li>
                {getPageNumbers().map((page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      page === pageIndex ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                <li class="page-item">
                  <button className="page-link" onClick={nextPage}>
                    Sonraki
                  </button>
                </li>
                <li class="page-item">
                  <button className="page-link" onClick={goToLastPage}>
                    Son
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Detail Modal */}
        <div
          className={`modal fade ${showDetailModal ? "show" : ""}`}
          tabIndex="-1"
          style={{ display: showDetailModal ? "block" : "none" }}
          aria-labelledby="detailModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="detailModalLabel">
                  Detay Modal
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseDetailModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {/* Detail Table */}
                <table className="table table-striped table-bordered table-hover table-sm">
                  <thead>
                    <tr>
                      <th>Personel</th>
                      <th>Bölge</th>
                      <th>Tarama Birimleri</th>
                      <th>Gerçekleşen</th>
                      <th>Mesai Süresi</th>
                    </tr>
                  </thead>
                  <tbody>
                  {completedTask.length === 0 ? (
              <tr>
                <td colSpan="5">No data available</td>
              </tr>
            ) : (
              completedTask.map((task) => (
                <tr key={task.id}>
                  <td>{task.userName}</td>
                  <td>{task.cityRegionName}</td>
                  <td>{task.unitTypeName}</td>
                  <td>{task.completedQuantity}</td>
                  <td>{task.workingHours}</td>
                </tr>
              ))
            )}
                    
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseDetailModal}
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Operation Modal */}
        <div
          className={`modal fade ${showOperationModal ? "show" : ""}`}
          tabIndex="-1"
          style={{ display: showOperationModal ? "block" : "none" }}
          aria-labelledby="operationModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="operationModalLabel">
                  Operasyon Modal
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseOperationModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <Formik
                  initialValues={{ taskId:"",quantity: "", startDate: "", endDate: "" }}
                  validationSchema={operationsSchema}
                  onSubmit={onOperationSubmit}
                >
                  {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                      <input id="taskId" type="hidden" />
                      <div className="mb-3">
                        <label htmlFor="quantity" className="form-label">
                          <i className="fas fa-hashtag"></i> Sayısal Değer
                        </label>
                        <Field
                          type="number"
                          id="quantity"
                          name="quantity"
                          className="form-control"
                          placeholder="Sayısal değer girin"
                        />
                        <ErrorMessage
                          name="quantity"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="startDate" className="form-label">
                          <i className="fas fa-calendar-day"></i> Başlangıç
                          Tarihi
                        </label>
                        <Field
                          type="datetime-local"
                          id="startDate"
                          name="startDate"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="startDate"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="endDate" className="form-label">
                          <i className="fas fa-calendar-day"></i> Bitiş Tarihi
                        </label>
                        <Field
                          type="datetime-local"
                          id="endDate"
                          name="endDate"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="endDate"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <button type="submit" className="btn btn-primary">
                        <i className="fas fa-save"></i> Kaydet
                      </button>
                    </form>
                  )}
                </Formik>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseOperationModal}
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
