// import React, { useState, useEffect } from "react";
// import { MdDelete, MdAdd } from "react-icons/md";
// import {
//   createChecklist,
//   allinfobuildingtoflat,
//   getPurposeByProjectId,
//   getPhaseByPurposeId,
//   GetstagebyPhaseid,
//   getCategoryTreeByProject,
//   createChecklistQuestion,
//   // createChecklistItemOption,
//   createChecklistItemOPTIONSS,
//   getChecklistById,
//   updateChecklistById,
// } from "../../api";
// import { showToast } from "../../utils/toast";
// import * as XLSX from "xlsx"; // Add this import
// import axios from "axios";

// const ChecklistForm = ({
//   setShowForm,
//   checklist,
//   projectOptions = [],
//   onChecklistCreated,
// }) => {
//   // Project and hierarchy
//   const [projectId, setProjectId] = useState("");
//   const [buildings, setBuildings] = useState([]);
//   const [levels, setLevels] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [flats, setFlats] = useState([]);
//   const [selectedBuilding, setSelectedBuilding] = useState("");
//   const [selectedLevel, setSelectedLevel] = useState("");
//   const [selectedZone, setSelectedZone] = useState("");
//   const [selectedFlat, setSelectedFlat] = useState("");

//   // Purpose/Phase/Stage
//   const [purposes, setPurposes] = useState([]);
//   const [phases, setPhases] = useState([]);
//   const [stages, setStages] = useState([]);
//   const [selectedPurpose, setSelectedPurpose] = useState("");
//   const [selectedPhase, setSelectedPhase] = useState("");
//   const [selectedStage, setSelectedStage] = useState("");
//   const [skipInitializer, setSkipInitializer] = useState(false);
//   // Category tree & category levels
//   const [categoryTree, setCategoryTree] = useState([]);
//   const [category, setCategory] = useState("");
//   const [cat1, setCat1] = useState("");
//   const [cat2, setCat2] = useState("");
//   const [cat3, setCat3] = useState("");
//   const [cat4, setCat4] = useState("");
//   const [cat5, setCat5] = useState("");
//   const [cat6, setCat6] = useState("");
//   const [sendAllUnits, setSendAllUnits] = useState(false);

//   // Checklist logic
//   const [options, setOptions] = useState([{ value: "", submission: "P" }]);
//   const [questions, setQuestions] = useState([
//     { question: "", options: [], photo_required: false },
//   ]);

//   const [numOfQuestions, setNumOfQuestions] = useState(1);
//   const isEdit = !!checklist;

//   // Checklist name
//   const [checklistName, setChecklistName] = useState("");

//   // Flat name object
//   const selectedFlatObj = flats.find(
//     (f) => String(f.id) === String(selectedFlat)
//   );

//   // Fill fields for edit
//   useEffect(() => {
//     if (checklist) {
//       setProjectId(checklist.project || "");
//       setChecklistName(checklist.name || "");
//       setCategory(checklist.category || "");
//       setCat1(checklist.CategoryLevel1 || "");
//       setCat2(checklist.CategoryLevel2 || "");
//       setCat3(checklist.CategoryLevel3 || "");
//       setCat4(checklist.CategoryLevel4 || "");
//       setCat5(checklist.CategoryLevel5 || "");
//       setCat6(checklist.CategoryLevel6 || "");
//       setQuestions(
//         checklist.questions || [
//           { question: "", options: [], photo_required: false },
//         ]
//       );
//       setSelectedBuilding(checklist.building || "");
//       setSelectedLevel(checklist.level || "");
//       setSelectedZone(checklist.zone || "");
//       setSelectedFlat(checklist.flat || "");
//       setSelectedPurpose(checklist.purpose || "");
//       setSelectedPhase(checklist.phase || "");
//       setSelectedStage(checklist.stage || "");
//     }
//   }, [checklist]);

//   // Fetch category tree when project changes
//   useEffect(() => {
//     if (!projectId) {
//       setCategoryTree([]);
//       setCategory("");
//       setCat1("");
//       setCat2("");
//       setCat3("");
//       setCat4("");
//       setCat5("");
//       setCat6("");
//       return;
//     }
//     getCategoryTreeByProject(projectId)
//       .then((res) => setCategoryTree(res.data || []))
//       .catch(() => {
//         setCategoryTree([]);
//         showToast("Failed to load categories", "error");
//       });
//   }, [projectId]);

//   // On project change, fetch buildings & purposes
//   useEffect(() => {
//     if (!projectId) {
//       setBuildings([]);
//       setLevels([]);
//       setZones([]);
//       setFlats([]);
//       setPurposes([]);
//       setPhases([]);
//       setStages([]);
//       setSelectedBuilding("");
//       setSelectedLevel("");
//       setSelectedZone("");
//       setSelectedFlat("");
//       setSelectedPurpose("");
//       setSelectedPhase("");
//       setSelectedStage("");
//       return;
//     }
//     allinfobuildingtoflat(projectId)
//       .then((res) => {
//         console.log("Buildings fetched:", res.data);
//         setBuildings(Array.isArray(res.data) ? res.data : []);
//       })
//       .catch(() => {
//         showToast("Failed to load buildings", "error");
//         setBuildings([]);
//       });
//     console.log(buildings, "this si response");

//     axios
//       .get(
//         `https://konstruct.world/projects/purpose/get-purpose-details-by-project-id/${projectId}/`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
//             "Content-Type": "application/json",
//           },
//         }
//       )
//       .then((res) => setPurposes(Array.isArray(res.data) ? res.data : []))
//       .catch(() => {
//         showToast("Failed to load purposes", "error");
//         setPurposes([]);
//       });
//     setLevels([]);
//     setZones([]);
//     setFlats([]);
//     setPhases([]);
//     setStages([]);
//     setSelectedBuilding("");
//     setSelectedLevel("");
//     setSelectedZone("");
//     setSelectedFlat("");
//     setSelectedPurpose("");
//     setSelectedPhase("");
//     setSelectedStage("");
//   }, [projectId]);

//   useEffect(() => {
//     if (isEdit && checklist?.id) {
//       const fetchChecklistDetails = async () => {
//         try {
//           const response = await getChecklistById(checklist.id);
//           const checklistData = response.data;

//           setChecklistName(checklistData.name || "");
//           setProjectId(checklistData.project_id || "");
//           setSelectedPurpose(checklistData.purpose_id || "");
//           setSelectedPhase(checklistData.phase_id || "");
//           setSelectedStage(checklistData.stage_id || "");
//           setCategory(checklistData.category || "");
//           setCat1(checklistData.category_level1 || "");
//           setCat2(checklistData.category_level2 || "");
//           setCat3(checklistData.category_level3 || "");
//           setCat4(checklistData.category_level4 || "");
//           setCat5(checklistData.category_level5 || "");
//           setCat6(checklistData.category_level6 || "");
//           setSelectedBuilding(checklistData.building_id || "");
//           setSelectedZone(checklistData.zone_id || "");
//           setSelectedFlat(checklistData.flat_id || "");

//           if (checklistData.items && checklistData.items.length > 0) {
//             const formattedQuestions = checklistData.items.map((item) => ({
//               question: item.title,
//               options: item.options
//                 ? item.options.map((opt) => ({
//                     value: opt.name,
//                     submission: opt.choice,
//                   }))
//                 : [],
//               photo_required: item.photo_required || false,
//             }));
//             setQuestions(formattedQuestions);
//           }
//         } catch (error) {
//           showToast("Failed to load checklist details", "error");
//         }
//       };

//       fetchChecklistDetails();
//     }
//   }, [isEdit, checklist?.id]);
//   // Levels by building
//   useEffect(() => {
//     if (!selectedBuilding) {
//       setLevels([]);
//       setZones([]);
//       setFlats([]);
//       setSelectedLevel("");
//       setSelectedZone("");
//       setSelectedFlat("");
//       return;
//     }
//     const b = buildings.find((x) => String(x.id) === String(selectedBuilding));
//     setLevels(b?.levels || []);
//     setSelectedLevel("");
//     setSelectedZone("");
//     setSelectedFlat("");
//     console.log("Levels for building", selectedBuilding, b?.levels || []);
//   }, [selectedBuilding, buildings]);

//   // Zones by level
//   useEffect(() => {
//     if (!selectedLevel) {
//       setZones([]);
//       setFlats([]);
//       setSelectedZone("");
//       setSelectedFlat("");
//       return;
//     }
//     const l = levels.find((x) => String(x.id) === String(selectedLevel));
//     setZones(l?.zones || []);
//     setSelectedZone("");
//     setSelectedFlat("");
//     console.log("Zones for level", selectedLevel, l?.zones || []);
//   }, [selectedLevel, levels]);

//   // Flats by zone
//   useEffect(() => {
//     if (!selectedZone) {
//       setFlats([]);
//       setSelectedFlat("");
//       return;
//     }
//     const z = zones.find((x) => String(x.id) === String(selectedZone));
//     setFlats(z?.flats || []);
//     setSelectedFlat("");
//     console.log("Flats for zone", selectedZone, z?.flats || []);
//   }, [selectedZone, zones]);

//   // On purpose change, fetch phases
//   useEffect(() => {
//     if (!selectedPurpose) {
//       setPhases([]);
//       setStages([]);
//       setSelectedPhase("");
//       setSelectedStage("");
//       return;
//     }
//     getPhaseByPurposeId(selectedPurpose)
//       .then((res) => setPhases(res.data || []))
//       .catch(() => {
//         showToast("Failed to load phases", "error");
//         setPhases([]);
//       });
//     setStages([]);
//     setSelectedPhase("");
//     setSelectedStage("");
//   }, [selectedPurpose]);

//   // On phase change, fetch stages
//   useEffect(() => {
//     if (!selectedPhase) {
//       setStages([]);
//       setSelectedStage("");
//       return;
//     }
//     GetstagebyPhaseid(selectedPhase)
//       .then((res) => setStages(res.data || []))
//       .catch(() => {
//         showToast("Failed to load stages");
//         setStages([]);
//       });
//     setSelectedStage("");
//   }, [selectedPhase]);

//   // Add Option to a Question
//   const handleQuestionOptionAdd = (qIdx) => {
//     setQuestions((prev) => {
//       const updated = [...prev];
//       // Ensure options array exists
//       if (!updated[qIdx].options) {
//         updated[qIdx].options = [];
//       }
//       updated[qIdx].options.push({ value: "", submission: "P" });
//       return updated;
//     });
//   };

//   // Change Option Value/Submission
//   const handleQuestionOptionChange = (qIdx, key, value, optIdx) => {
//     setQuestions((prev) => {
//       const updated = [...prev];
//       // Ensure options array exists
//       if (!updated[qIdx].options) {
//         updated[qIdx].options = [];
//       }
//       // Ensure the option exists
//       if (!updated[qIdx].options[optIdx]) {
//         updated[qIdx].options[optIdx] = { value: "", submission: "P" };
//       }
//       updated[qIdx].options[optIdx][key] = value;
//       return updated;
//     });
//   };

//   // Remove Option from a Question
//   const handleQuestionOptionRemove = (qIdx, optIdx) => {
//     setQuestions((prev) => {
//       const updated = [...prev];
//       if (updated[qIdx].options && updated[qIdx].options.length > optIdx) {
//         updated[qIdx].options = updated[qIdx].options.filter(
//           (_, idx) => idx !== optIdx
//         );
//       }
//       return updated;
//     });
//   };

//   // Improved "Add More Questions" handler
//   const handleAddMoreQuestions = () => {
//     const toAdd = [];
//     for (let i = 0; i < numOfQuestions; i++) {
//       toAdd.push({
//         question: "",
//         options: [], // Start with empty options array
//         photo_required: false,
//       });
//     }
//     setQuestions([...questions, ...toAdd]);
//   };

//   // Nested category helpers
//   const getLevelOptions = (levelKey) => {
//     if (levelKey === 1) {
//       return categoryTree;
//     }
//     if (levelKey === 2 && category) {
//       return (
//         categoryTree.find((cat) => String(cat.id) === String(category))
//           ?.level1 || []
//       );
//     }
//     if (levelKey === 3 && cat1) {
//       const catObj = categoryTree.find(
//         (cat) => String(cat.id) === String(category)
//       );
//       return (
//         catObj?.level1.find((l1) => String(l1.id) === String(cat1))?.level2 ||
//         []
//       );
//     }
//     if (levelKey === 4 && cat2) {
//       const catObj = categoryTree.find(
//         (cat) => String(cat.id) === String(category)
//       );
//       const cat1Obj = catObj?.level1.find(
//         (l1) => String(l1.id) === String(cat1)
//       );
//       return (
//         cat1Obj?.level2.find((l2) => String(l2.id) === String(cat2))?.level3 ||
//         []
//       );
//     }
//     if (levelKey === 5 && cat3) {
//       const catObj = categoryTree.find(
//         (cat) => String(cat.id) === String(category)
//       );
//       const cat1Obj = catObj?.level1.find(
//         (l1) => String(l1.id) === String(cat1)
//       );
//       const cat2Obj = cat1Obj?.level2.find(
//         (l2) => String(l2.id) === String(cat2)
//       );
//       return (
//         cat2Obj?.level3.find((l3) => String(l3.id) === String(cat3))?.level4 ||
//         []
//       );
//     }
//     if (levelKey === 6 && cat4) {
//       const catObj = categoryTree.find(
//         (cat) => String(cat.id) === String(category)
//       );
//       const cat1Obj = catObj?.level1.find(
//         (l1) => String(l1.id) === String(cat1)
//       );
//       const cat2Obj = cat1Obj?.level2.find(
//         (l2) => String(l2.id) === String(cat2)
//       );
//       const cat3Obj = cat2Obj?.level3.find(
//         (l3) => String(l3.id) === String(cat3)
//       );
//       return (
//         cat3Obj?.level4.find((l4) => String(l4.id) === String(cat4))?.level5 ||
//         []
//       );
//     }
//     return [];
//   };

//   // On changing any category level, reset lower levels
//   const handleCategoryChange = (e) => {
//     setCategory(e.target.value);
//     setCat1("");
//     setCat2("");
//     setCat3("");
//     setCat4("");
//     setCat5("");
//     setCat6("");
//   };
//   const handleCat1Change = (e) => {
//     setCat1(e.target.value);
//     setCat2("");
//     setCat3("");
//     setCat4("");
//     setCat5("");
//     setCat6("");
//   };
//   const handleCat2Change = (e) => {
//     setCat2(e.target.value);
//     setCat3("");
//     setCat4("");
//     setCat5("");
//     setCat6("");
//   };
//   const handleCat3Change = (e) => {
//     setCat3(e.target.value);
//     setCat4("");
//     setCat5("");
//     setCat6("");
//   };
//   const handleCat4Change = (e) => {
//     setCat4(e.target.value);
//     setCat5("");
//     setCat6("");
//   };
//   const handleCat5Change = (e) => {
//     setCat5(e.target.value);
//     setCat6("");
//   };
//   const handleCat6Change = (e) => {
//     setCat6(e.target.value);
//   };

//   const handleCreateChecklist = async () => {
//     // Enhanced validation
//     if (!checklistName.trim()) return showToast("Checklist name required!");
//     if (!projectId || projectId === "") return showToast("Select a project");
//     if (!selectedPurpose || selectedPurpose === "")
//       return showToast("Select a purpose");
//     if (!category || category === "") return showToast("Select a category");
//     if (!questions.length) return showToast("Add at least one question");

//     // for (let q of questions) {
//     //   if (!q.question?.trim()) return showToast("All questions must have text");
//     // }

//     // Convert and validate IDs
//     const parsedProjectId = parseInt(projectId);
//     const parsedPurposeId = parseInt(selectedPurpose);
//     const parsedCategoryId = parseInt(category);

//     if (isNaN(parsedProjectId)) return showToast("Invalid project selected");
//     if (isNaN(parsedPurposeId)) return showToast("Invalid purpose selected");
//     if (isNaN(parsedCategoryId)) return showToast("Invalid category selected");

//     console.log("Project ID:", parsedProjectId);

//     const checklistPayload = {
//       name: checklistName,
//       project_id: parsedProjectId,
//       purpose_id: parsedPurposeId,
//       phase_id:
//         selectedPhase && selectedPhase !== "" ? parseInt(selectedPhase) : null,
//       stage_id:
//         selectedStage && selectedStage !== "" ? parseInt(selectedStage) : null,
//       category: parsedCategoryId,
//       category_level1: cat1 && cat1 !== "" ? parseInt(cat1) : null,
//       category_level2: cat2 && cat2 !== "" ? parseInt(cat2) : null,
//       category_level3: cat3 && cat3 !== "" ? parseInt(cat3) : null,
//       category_level4: cat4 && cat4 !== "" ? parseInt(cat4) : null,
//       category_level5: cat5 && cat5 !== "" ? parseInt(cat5) : null,
//       category_level6: cat6 && cat6 !== "" ? parseInt(cat6) : null,
//       building_id:
//         selectedBuilding && selectedBuilding !== ""
//           ? parseInt(selectedBuilding)
//           : null,
//       zone_id:
//         selectedZone && selectedZone !== "" ? parseInt(selectedZone) : null,
//       flat_id:
//         selectedFlat && selectedFlat !== "" ? parseInt(selectedFlat) : null,
//       remarks: "",
//       not_initialized: skipInitializer,
//       // send_all_units: sendAllUnits,
//     };
//     // ADD THE DEBUG CONSOLE LOGS HERE ⬇️⬇️⬇️
//     console.log("=== CHECKLIST CREATION DEBUG ===");
//     console.log("sendAllUnits:", sendAllUnits);
//     console.log("isEdit:", isEdit);
//     console.log("checklistPayload:", checklistPayload);
//     try {
//       console.log("Payload being sent:", checklistPayload);

//       let checklistRes;
//       let checklistId;

//       if (isEdit && checklist?.id) {
//         // UPDATE existing checklist (keep existing logic)
//         checklistRes = await updateChecklistById(
//           checklist.id,
//           checklistPayload
//         );
//         checklistId = checklist.id;
//         showToast("Checklist updated successfully!", "success");
//       } else {
//         // Check if Apply to All Units is enabled
//          console.log(
//            "🔍 Let's check what URL createChecklist function uses..."
//          );
//          console.log(
//            "🔍 Look in Network tab when creating single checklist to see the exact URL"
//          );
//         if (sendAllUnits) {
//           // Use bulk creation API
//           console.log("🚀 BULK CREATION MODE ACTIVATED");
//           const bulkPayload = {
//             ...checklistPayload,
//             description: checklistPayload.remarks || "Bulk checklist creation",
//             created_by_id: 1, // You might want to get this from user context
//             items: questions.map((q) => ({
//               title: q.question,
//               description: q.question,
//               status: "not_started",
//               ignore_now: false,
//               photo_required: q.photo_required || false,
//               options: (q.options || [])
//                 .filter((opt) => opt.value && opt.value.trim() !== "")
//                 .map((opt) => ({
//                   name: opt.value,
//                   choice: opt.submission,
//                 })),
//             })),
//           };
//           console.log("📦 Bulk Payload being sent:", bulkPayload);
//           console.log("📦 Items count:", bulkPayload.items.length);
//           console.log("📦 First item options:", bulkPayload.items[0]?.options);
//           // Direct API call to bulk endpoint
//           checklistRes = await axios.post(
//             "https://konstruct.world/checklists/checklists/create/",
//             bulkPayload,
//             {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
//                 "Content-Type": "application/json",
//               },
//             }
//           );
//           console.log("✅ Bulk API Response:", checklistRes.data);
//           console.log(
//             "✅ Created checklist IDs:",
//             checklistRes.data.checklist_ids
//           );
//           showToast(
//             `Checklists created for all units successfully! Created ${
//               checklistRes.data.checklist_ids?.length || 0
//             } checklists`,
//             "success"
//           );
//         } else {
//           // Single checklist creation (existing logic)
//           console.log("🎯 SINGLE CREATION MODE");
//           checklistRes = await createChecklist(checklistPayload);
//           checklistId =
//             checklistRes.data?.id ||
//             checklistRes.data?.pk ||
//             checklistRes.data?.ID;
//           showToast("Checklist created successfully!", "success");
//         }
//       }

//       if (
//         checklistRes.status === 201 ||
//         checklistRes.status === 200 ||
//         checklistRes.data?.id ||
//         checklistRes.data?.checklist_ids
//       ) {
//         // Only create items and options for single checklist (not bulk)
//         console.log("🎉 SUCCESS CONDITION MET");
//         console.log("Response status:", checklistRes.status);
//         console.log("Has single ID:", !!checklistRes.data?.id);
//         console.log("Has bulk IDs:", !!checklistRes.data?.checklist_ids);

//         if (!sendAllUnits && !isEdit) {
//           // Create items and options for single checklist
//           for (let i = 0; i < questions.length; i++) {
//             const q = questions[i];

//             // 1. Create ChecklistItem (question)
//             const itemRes = await createChecklistQuestion({
//               checklist: checklistId,
//               title: q.question,
//               photo_required: q.photo_required || false,
//               is_done: false,
//             });

//             const checklistItemId = itemRes.data?.id;

//             // 2. Create options for that question (only if options exist and have values)
//             if (checklistItemId && q.options?.length) {
//               for (let option of q.options) {
//                 if (option.value && option.value.trim() !== "") {
//                   await createChecklistItemOPTIONSS({
//                     checklist_item: checklistItemId,
//                     name: option.value,
//                     choice: option.submission,
//                   });
//                 }
//               }
//             }
//           }
//         }
//         // Call the callback function to show user access table
//         // Call the callback function to show user access table
//         if (
//           !isEdit &&
//           onChecklistCreated &&
//           typeof onChecklistCreated === "function"
//         ) {
//           if (sendAllUnits) {
//             // For bulk creation, pass the first checklist ID or a special indicator
//             console.log("📤 Calling callback for BULK creation");
//             const createdChecklistData = {
//               ...checklistPayload,
//               id: checklistRes.data?.checklist_ids?.[0] || null,
//               project_id: parsedProjectId,
//               category_id: parsedCategoryId,
//               is_bulk: true,
//               checklist_count: checklistRes.data?.checklist_ids?.length || 0,
//             };
//             console.log("📤 Bulk callback data:", createdChecklistData);
//             onChecklistCreated(createdChecklistData);
//           } else {
//             const createdChecklistData = {
//               ...checklistPayload,
//               id: checklistId,
//               project_id: parsedProjectId,
//               category_id: parsedCategoryId,
//             };
//             console.log("📤 Single callback data:", createdChecklistData);
//             onChecklistCreated(createdChecklistData);
//           }
//         }

//         setShowForm(false);
//       } else {
//         console.error("Checklist creation failed:", checklistRes);
//         showToast(
//           checklistRes.data?.message || "Failed to create checklist",
//           "error"
//         );
//       }
//     } catch (error) {
//       console.error("Error creating checklist:", "error");

//       // More detailed error handling
//       if (error.response) {
//         console.error("Error response:", error.response.data);
//         const errorMessage =
//           error.response.data?.message ||
//           error.response.data?.detail ||
//           `Server error: ${error.response.status}`;
//         showToast(errorMessage);
//       } else {
//         showToast(
//           "Failed to create checklist and questions. Please try again.",
//           "error"
//         );
//       }
//     }
//   };

//   // Bulk upload handler
//   const handleBulkUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       try {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: "array" });
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const jsonData = XLSX.utils.sheet_to_json(worksheet);

//         const bulkQuestions = [];

//         jsonData.forEach((row) => {
//           // Expected columns: Question, Options, PhotoRequired
//           // Options format: "Option1(P)|Option2(N)|Option3(P)"
//           const question = row["Question"] || row["question"] || "";
//           const optionsString = row["Options"] || row["options"] || "";
//           const photoRequired =
//             row["PhotoRequired"] || row["photo_required"] || false;

//           const options = [];
//           if (optionsString) {
//             const optionPairs = optionsString.split("|");
//             optionPairs.forEach((pair) => {
//               const match = pair.match(/^(.+)\(([PN])\)$/);
//               if (match) {
//                 options.push({
//                   value: match[1].trim(),
//                   submission: match[2],
//                 });
//               }
//             });
//           }

//           if (question.trim()) {
//             bulkQuestions.push({
//               question: question.trim(),
//               options: options,
//               photo_required:
//                 photoRequired === true ||
//                 photoRequired === "true" ||
//                 photoRequired === "True",
//             });
//           }
//         });

//         if (bulkQuestions.length > 0) {
//           setQuestions([...questions, ...bulkQuestions]);
//           showToast(
//             `${bulkQuestions.length} questions uploaded successfully!`,
//             "success"
//           );
//         } else {
//           showToast("No valid questions found in the file", "error");
//         }

//         // Reset file input
//         event.target.value = "";
//       } catch (error) {
//         showToast("Error reading file. Please check the format.", "error");
//       }
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   return (
//     <div className="p-8 bg-white rounded-lg shadow-md">
//       {/* Checklist Name Input */}
//       <div className="mb-2">
//         <label className="block font-bold text-lg mb-1">
//           Checklist Name <span className="text-red-500">*</span>
//         </label>
//         <input
//           type="text"
//           className="w-full p-2 border border-gray-300 rounded"
//           placeholder="Enter checklist name"
//           value={checklistName}
//           onChange={(e) => setChecklistName(e.target.value)}
//           required
//         />
//       </div>

//       {/* Show the checklist name as heading if filled */}
//       {checklistName && (
//         <div className="mb-4 p-3 rounded-lg bg-gray-100 border text-xl font-semibold text-purple-800 text-center">
//           {checklistName}
//         </div>
//       )}

//       {/* Flat name display */}
//       {selectedFlatObj && (
//         <div className="mb-4 p-3 rounded-lg bg-blue-100 border text-lg font-semibold text-blue-800 text-center">
//           Flat: {selectedFlatObj.number}
//         </div>
//       )}

//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-xl font-semibold">
//           {isEdit ? "Edit Checklist" : "Add Checklist"}
//         </h1>
//         <button
//           className="bg-purple-700 text-white p-2 rounded"
//           onClick={() => setShowForm(false)}
//         >
//           Back
//         </button>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         {/* Project Dropdown */}
//         <div>
//           <label className="block text-gray-700 mb-1">
//             Project <span className="text-red-500">*</span>
//           </label>
//           <select
//             className="w-full p-2 border border-gray-300 rounded"
//             value={projectId}
//             onChange={(e) => setProjectId(e.target.value)}
//           >
//             <option value="">Select Project</option>
//             {(Array.isArray(projectOptions) ? projectOptions : []).map(
//               (proj) => (
//                 <option key={proj.id} value={proj.id}>
//                   {proj.name}
//                 </option>
//               )
//             )}
//           </select>
//         </div>
//         {/* Building Dropdown */}
//         {buildings.length > 0 && (
//           <div>
//             <label className="block text-gray-700 mb-1">Tower / Building</label>
//             <select
//               className="w-full p-2 border border-gray-300 rounded"
//               value={selectedBuilding}
//               onChange={(e) => {
//                 setSelectedBuilding(e.target.value);
//                 console.log("Building selected:", e.target.value);
//               }}
//             >
//               <option value="">Select Building</option>
//               {(Array.isArray(buildings) ? buildings : []).map((b) => (
//                 <option key={b.id} value={b.id}>
//                   {b.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//         {/* Level Dropdown */}
//         {levels.length > 0 && (
//           <div>
//             <label className="block text-gray-700 mb-1">Level</label>
//             <select
//               className="w-full p-2 border border-gray-300 rounded"
//               value={selectedLevel}
//               onChange={(e) => {
//                 setSelectedLevel(e.target.value);
//                 console.log("Level selected:", e.target.value);
//               }}
//             >
//               <option value="">Select Level</option>
//               {levels.map((l) => (
//                 <option key={l.id} value={l.id}>
//                   {l.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//         {/* Zone Dropdown */}
//         {zones.length > 0 && (
//           <div>
//             <label className="block text-gray-700 mb-1">Zone</label>
//             <select
//               className="w-full p-2 border border-gray-300 rounded"
//               value={selectedZone}
//               onChange={(e) => {
//                 setSelectedZone(e.target.value);
//                 console.log("Zone selected:", e.target.value);
//               }}
//             >
//               <option value="">Select Zone</option>
//               {zones.map((z) => (
//                 <option key={z.id} value={z.id}>
//                   {z.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//         {/* Flat Dropdown */}
//         {flats.length > 0 && (
//           <div>
//             <label className="block text-gray-700 mb-1">Flat</label>
//             <select
//               className="w-full p-2 border border-gray-300 rounded"
//               value={selectedFlat}
//               onChange={(e) => {
//                 setSelectedFlat(e.target.value);
//                 console.log("Flat selected:", e.target.value);
//               }}
//             >
//               <option value="">Select Flat</option>
//               {flats.map((f) => (
//                 <option key={f.id} value={f.id}>
//                   {f.number}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//         {/* Purpose Dropdown */}
//         {purposes.length > 0 && (
//           <div>
//             <label className="block text-gray-700 mb-1">
//               Purpose <span className="text-red-500">*</span>
//             </label>
//             <select
//               className="w-full p-2 border border-gray-300 rounded"
//               value={selectedPurpose}
//               onChange={(e) => setSelectedPurpose(e.target.value)}
//             >
//               <option value="">Select Purpose</option>
//               {purposes.map((p) => (
//                 <option key={p.id} value={p.id}>
//                   {p.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//         {/* Phase Dropdown */}
//         {phases.length > 0 && (
//           <div>
//             <label className="block text-gray-700 mb-1">Phase</label>
//             <select
//               className="w-full p-2 border border-gray-300 rounded"
//               value={selectedPhase}
//               onChange={(e) => setSelectedPhase(e.target.value)}
//             >
//               <option value="">Select Phase</option>
//               {phases.map((ph) => (
//                 <option key={ph.id} value={ph.id}>
//                   {ph.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//         {/* Stage Dropdown */}
//         {stages.length > 0 && (
//           <div>
//             <label className="block text-gray-700 mb-1">Stage</label>
//             <select
//               className="w-full p-2 border border-gray-300 rounded"
//               value={selectedStage}
//               onChange={(e) => setSelectedStage(e.target.value)}
//             >
//               <option value="">Select Stage</option>
//               {stages.map((st) => (
//                 <option key={st.id} value={st.id}>
//                   {st.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//         {/* Category Level 1 */}
//         <div>
//           <label className="block text-gray-700 mb-1">
//             Category <span className="text-red-500">*</span>
//           </label>
//           <select
//             className="w-full p-2 border border-gray-300 rounded"
//             value={category}
//             onChange={handleCategoryChange}
//           >
//             <option value="">Select Category</option>
//             {getLevelOptions(1).map((opt) => (
//               <option key={opt.id} value={opt.id}>
//                 {opt.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         {/* Category Level 2 */}
//         {getLevelOptions(2).length > 0 && (
//           <div>
//             <label className="block text-gray-700 mb-1">Category Level 2</label>
//             <select
//               className="w-full p-2 border border-gray-300 rounded"
//               value={cat1}
//               onChange={handleCat1Change}
//             >
//               <option value="">Select Level 2</option>
//               {getLevelOptions(2).map((opt) => (
//                 <option key={opt.id} value={opt.id}>
//                   {opt.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//         {/* Category Level 3 */}
//         {getLevelOptions(3).length > 0 && (
//           <div>
//             <label className="block text-gray-700 mb-1">Category Level 3</label>
//             <select
//               className="w-full p-2 border border-gray-300 rounded"
//               value={cat2}
//               onChange={handleCat2Change}
//             >
//               <option value="">Select Level 3</option>
//               {getLevelOptions(3).map((opt) => (
//                 <option key={opt.id} value={opt.id}>
//                   {opt.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//         {/* Category Level 4 */}
//         {getLevelOptions(4).length > 0 && (
//           <div>
//             <label className="block text-gray-700 mb-1">Category Level 4</label>
//             <select
//               className="w-full p-2 border border-gray-300 rounded"
//               value={cat3}
//               onChange={handleCat3Change}
//             >
//               <option value="">Select Level 4</option>
//               {getLevelOptions(4).map((opt) => (
//                 <option key={opt.id} value={opt.id}>
//                   {opt.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//         {/* Category Level 5 */}
//         {getLevelOptions(5).length > 0 && (
//           <div>
//             <label className="block text-gray-700 mb-1">Category Level 5</label>
//             <select
//               className="w-full p-2 border border-gray-300 rounded"
//               value={cat4}
//               onChange={handleCat4Change}
//             >
//               <option value="">Select Level 5</option>
//               {getLevelOptions(5).map((opt) => (
//                 <option key={opt.id} value={opt.id}>
//                   {opt.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//         {/* Category Level 6 */}
//         {getLevelOptions(6).length > 0 && (
//           <div>
//             <label className="block text-gray-700 mb-1">Category Level 6</label>
//             <select
//               className="w-full p-2 border border-gray-300 rounded"
//               value={cat5}
//               onChange={handleCat5Change}
//             >
//               <option value="">Select Level 6</option>
//               {getLevelOptions(6).map((opt) => (
//                 <option key={opt.id} value={opt.id}>
//                   {opt.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//       </div>
//       <div className="flex items-center gap-4 mb-4">
//         <button
//           className={`p-2 rounded transition-colors ${
//             sendAllUnits
//               ? "bg-blue-800 text-white"
//               : "bg-blue-600 text-white hover:bg-blue-700"
//           }`}
//           type="button"
//           onClick={() => setSendAllUnits(!sendAllUnits)}
//         >
//           {sendAllUnits ? "✓ Apply to All Units" : "Apply to All Units"}
//         </button>
//         {sendAllUnits && (
//           <span className="text-blue-600 font-semibold">
//             Will create checklists for all units at the selected level
//           </span>
//         )}
//       </div>

//       <div className="flex items-center gap-2 mb-4">
//         <input
//           type="checkbox"
//           id="skip-initializer"
//           checked={skipInitializer}
//           onChange={(e) => setSkipInitializer(e.target.checked)}
//           className="accent-purple-700"
//         />
//         <label
//           htmlFor="skip-initializer"
//           className="font-medium text-purple-800"
//         >
//           Skip Initializer (Start checklist as In Progress)
//         </label>
//       </div>
//       {/* Question/Option Section */}
//       <div className="mb-6">
//         <h2 className="text-lg font-semibold mb-2">Add Questions</h2>
//         <div className="grid grid-cols-6 gap-4 mb-4">
//           <label className="col-span-2">Add No. of Questions</label>
//           <input
//             type="number"
//             className="w-full p-2 border border-gray-300 rounded col-span-1"
//             min={1}
//             value={numOfQuestions}
//             onChange={(e) => setNumOfQuestions(Number(e.target.value))}
//           />
//           <button
//             onClick={handleAddMoreQuestions}
//             className="bg-purple-600 text-white p-2 rounded col-span-2"
//           >
//             Add More Questions
//           </button>
//         </div>
//         <div className="grid grid-cols-6 gap-4 mb-4 items-center">
//           <label className="col-span-2 font-medium">
//             Bulk Upload Questions
//           </label>
//           <input
//             type="file"
//             accept=".xlsx,.xls,.csv"
//             onChange={handleBulkUpload}
//             className="col-span-2 p-2 border border-gray-300 rounded text-sm"
//           />
//           <button
//             onClick={() => {
//               const link = document.createElement("a");
//               link.href =
//                 'data:text/plain;charset=utf-8,Question,Options,PhotoRequired\n"What is the quality?","Good(P)|Bad(N)|Average(P)",false\n"Check alignment","Aligned(P)|Not Aligned(N)",true';
//               link.download = "questions_template.csv";
//               link.click();
//             }}
//             className="bg-green-600 text-white p-2 rounded col-span-2 text-sm"
//           >
//             Download Template
//           </button>
//         </div>
//         <div className="flex flex-col gap-4">
//           {questions.map((q, qIdx) => (
//             <div
//               key={qIdx}
//               className="mb-4 bg-gray-50 border border-purple-300 rounded-xl shadow flex flex-col p-4 gap-4 relative"
//               style={{
//                 borderLeft: "6px solid #9333ea",
//                 minHeight: "72px",
//               }}
//             >
//               <div className="flex items-center gap-4">
//                 <span
//                   className="text-purple-700 font-bold text-xl flex-shrink-0"
//                   style={{
//                     width: 36,
//                     height: 36,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     background: "#ede9fe",
//                     borderRadius: "50%",
//                     marginRight: 12,
//                     border: "2px solid #c4b5fd",
//                   }}
//                 >
//                   {qIdx + 1}
//                 </span>
//                 <input
//                   type="text"
//                   placeholder={`Enter your question ${qIdx + 1}`}
//                   className="flex-1 p-2 border border-gray-300 rounded text-lg font-medium bg-white focus:border-purple-500"
//                   value={q.question}
//                   onChange={(e) =>
//                     setQuestions((prev) => {
//                       const updated = [...prev];
//                       updated[qIdx] = {
//                         ...updated[qIdx],
//                         question: e.target.value,
//                       };
//                       return updated;
//                     })
//                   }
//                 />
//                 {/* Photo Required Toggle */}
//                 <label className="flex items-center gap-2 ml-2 text-purple-800 font-medium">
//                   <input
//                     type="checkbox"
//                     checked={!!q.photo_required}
//                     onChange={(e) =>
//                       setQuestions((prev) => {
//                         const updated = [...prev];
//                         updated[qIdx] = {
//                           ...updated[qIdx],
//                           photo_required: e.target.checked,
//                         };
//                         return updated;
//                       })
//                     }
//                     className="accent-purple-600 w-5 h-5"
//                   />
//                   Photo Required
//                 </label>
//                 <button
//                   className="text-red-600 hover:bg-red-100 rounded p-2 transition"
//                   onClick={() => {
//                     if (questions.length === 1) {
//                       showToast("At least one question is required", "error");
//                       return;
//                     }
//                     setQuestions(questions.filter((_, idx) => idx !== qIdx));
//                   }}
//                   title="Remove"
//                 >
//                   <MdDelete size={22} />
//                 </button>
//               </div>
//               {/* Options */}
//               <div className="flex flex-wrap items-center gap-2 pl-10">
//                 {(q.options || []).map((option, optIdx) => (
//                   <div
//                     key={optIdx}
//                     className="flex items-center justify-between gap-2 border border-gray-300 rounded-md p-2"
//                   >
//                     <input
//                       type="text"
//                       placeholder="Add Option"
//                       className="w-full outline-none border-none"
//                       value={option.value || ""}
//                       onChange={(e) =>
//                         handleQuestionOptionChange(
//                           qIdx,
//                           "value",
//                           e.target.value,
//                           optIdx
//                         )
//                       }
//                     />
//                     <select
//                       value={option.submission || "P"}
//                       onChange={(e) =>
//                         handleQuestionOptionChange(
//                           qIdx,
//                           "submission",
//                           e.target.value,
//                           optIdx
//                         )
//                       }
//                       style={{
//                         backgroundColor:
//                           option.submission === "P" ? "Green" : "Red",
//                         color: "white",
//                         borderRadius: "8px",
//                       }}
//                     >
//                       <option value="P">P</option>
//                       <option value="N">N</option>
//                     </select>
//                     <button
//                       className="text-red-600"
//                       onClick={() => handleQuestionOptionRemove(qIdx, optIdx)}
//                       title="Remove Option"
//                     >
//                       <MdDelete />
//                     </button>
//                   </div>
//                 ))}
//                 <button
//                   className="bg-purple-600 text-white p-2 rounded"
//                   onClick={() => handleQuestionOptionAdd(qIdx)}
//                   type="button"
//                 >
//                   <MdAdd />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="flex gap-4 mt-6">
//         <button
//           className="bg-purple-700 text-white p-3 rounded"
//           onClick={handleCreateChecklist}
//         >
//           {isEdit ? "Update Checklist" : "Create Checklist"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChecklistForm;


import React, { useState, useEffect } from "react";
import { MdDelete, MdAdd } from "react-icons/md";
import {
  createChecklist,
  allinfobuildingtoflat,
  getPurposeByProjectId,
  getPhaseByPurposeId,
  GetstagebyPhaseid,
  getCategoryTreeByProject,
  createChecklistQuestion,
  createChecklistItemOPTIONSS,
  getChecklistById,
  updateChecklistById,
} from "../../api";
import { showToast } from "../../utils/toast";
import * as XLSX from "xlsx";
import axios from "axios";
import SideBarSetup from "../../components/SideBarSetup";
import { useTheme } from "../../ThemeContext";

const ChecklistForm = ({
  setShowForm,
  checklist,
  projectOptions = [],
  onChecklistCreated,
}) => {
  const { theme } = useTheme();

  // Color palette - exact same as main component
  const palette =
    theme === "dark"
      ? {
          selectText: "text-yellow-300",
          selectBg: "bg-[#191919]",
          bg: "#0a0a0f",
          card: "bg-gradient-to-br from-[#191919] to-[#181820]",
          text: "text-yellow-100",
          textSecondary: "text-yellow-200/70",
          border: "border-yellow-600/30",
          tableHead: "bg-[#191919] text-yellow-300 border-yellow-600/30",
          tableRow: "hover:bg-yellow-900/5 border-yellow-600/10",
          shadow: "shadow-2xl shadow-yellow-900/20",
          primary:
            "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold hover:from-yellow-600 hover:to-yellow-700",
          secondary:
            "bg-gradient-to-r from-yellow-900 to-yellow-800 text-yellow-100 hover:from-yellow-800 hover:to-yellow-700",
          badge:
            "bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500",
          badgeText: "text-yellow-900 font-bold",
          success:
            "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800",
          warning:
            "bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800",
          danger:
            "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800",
          info: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800",
        }
      : {
          selectText: "text-gray-900",
          selectBg: "bg-white",
          bg: "#faf9f7",
          card: "bg-gradient-to-br from-white to-orange-50/30",
          text: "text-orange-900",
          textSecondary: "text-orange-700/70",
          border: "border-orange-300/60",
          tableHead: "bg-orange-50 text-orange-700 border-orange-300/60",
          tableRow: "hover:bg-orange-50 border-orange-100/30",
          shadow: "shadow-xl shadow-orange-200/30",
          primary:
            "bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700",
          secondary:
            "bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600",
          badge:
            "bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500",
          badgeText: "text-orange-900 font-bold",
          success:
            "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700",
          warning:
            "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700",
          danger:
            "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700",
          info: "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700",
        };

  // ALL EXISTING STATE - NO CHANGES
  const [projectId, setProjectId] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [levels, setLevels] = useState([]);
  const [zones, setZones] = useState([]);
  const [flats, setFlats] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedFlat, setSelectedFlat] = useState("");

  const [purposes, setPurposes] = useState([]);
  const [phases, setPhases] = useState([]);
  const [stages, setStages] = useState([]);
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [selectedPhase, setSelectedPhase] = useState("");
  const [selectedStage, setSelectedStage] = useState("");
  const [skipInitializer, setSkipInitializer] = useState(false);

  const [categoryTree, setCategoryTree] = useState([]);
  const [category, setCategory] = useState("");
  const [cat1, setCat1] = useState("");
  const [cat2, setCat2] = useState("");
  const [cat3, setCat3] = useState("");
  const [cat4, setCat4] = useState("");
  const [cat5, setCat5] = useState("");
  const [cat6, setCat6] = useState("");
  const [sendAllUnits, setSendAllUnits] = useState(false);

  const [options, setOptions] = useState([{ value: "", submission: "P" }]);
  const [questions, setQuestions] = useState([
    { question: "", options: [], photo_required: false },
  ]);

  const [numOfQuestions, setNumOfQuestions] = useState(1);
  const isEdit = !!checklist;
  const [checklistName, setChecklistName] = useState("");

  const selectedFlatObj = flats.find(
    (f) => String(f.id) === String(selectedFlat)
  );

  // ALL EXISTING useEffect HOOKS - NO CHANGES
  useEffect(() => {
    if (checklist) {
      setProjectId(checklist.project || "");
      setChecklistName(checklist.name || "");
      setCategory(checklist.category || "");
      setCat1(checklist.CategoryLevel1 || "");
      setCat2(checklist.CategoryLevel2 || "");
      setCat3(checklist.CategoryLevel3 || "");
      setCat4(checklist.CategoryLevel4 || "");
      setCat5(checklist.CategoryLevel5 || "");
      setCat6(checklist.CategoryLevel6 || "");
      setQuestions(
        checklist.questions || [
          { question: "", options: [], photo_required: false },
        ]
      );
      setSelectedBuilding(checklist.building || "");
      setSelectedLevel(checklist.level || "");
      setSelectedZone(checklist.zone || "");
      setSelectedFlat(checklist.flat || "");
      setSelectedPurpose(checklist.purpose || "");
      setSelectedPhase(checklist.phase || "");
      setSelectedStage(checklist.stage || "");
    }
  }, [checklist]);

  useEffect(() => {
    if (!projectId) {
      setCategoryTree([]);
      setCategory("");
      setCat1("");
      setCat2("");
      setCat3("");
      setCat4("");
      setCat5("");
      setCat6("");
      return;
    }
    getCategoryTreeByProject(projectId)
      .then((res) => setCategoryTree(res.data || []))
      .catch(() => {
        setCategoryTree([]);
        showToast("Failed to load categories", "error");
      });
  }, [projectId]);

  useEffect(() => {
    if (!projectId) {
      setBuildings([]);
      setLevels([]);
      setZones([]);
      setFlats([]);
      setPurposes([]);
      setPhases([]);
      setStages([]);
      setSelectedBuilding("");
      setSelectedLevel("");
      setSelectedZone("");
      setSelectedFlat("");
      setSelectedPurpose("");
      setSelectedPhase("");
      setSelectedStage("");
      return;
    }
    allinfobuildingtoflat(projectId)
      .then((res) => {
        console.log("Buildings fetched:", res.data);
        setBuildings(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        showToast("Failed to load buildings", "error");
        setBuildings([]);
      });
    console.log(buildings, "this si response");

    axios
      .get(
        `https://konstruct.world/projects/purpose/get-purpose-details-by-project-id/${projectId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => setPurposes(Array.isArray(res.data) ? res.data : []))
      .catch(() => {
        showToast("Failed to load purposes", "error");
        setPurposes([]);
      });
    setLevels([]);
    setZones([]);
    setFlats([]);
    setPhases([]);
    setStages([]);
    setSelectedBuilding("");
    setSelectedLevel("");
    setSelectedZone("");
    setSelectedFlat("");
    setSelectedPurpose("");
    setSelectedPhase("");
    setSelectedStage("");
  }, [projectId]);

  useEffect(() => {
    if (isEdit && checklist?.id) {
      const fetchChecklistDetails = async () => {
        try {
          const response = await getChecklistById(checklist.id);
          const checklistData = response.data;

          setChecklistName(checklistData.name || "");
          setProjectId(checklistData.project_id || "");
          setSelectedPurpose(checklistData.purpose_id || "");
          setSelectedPhase(checklistData.phase_id || "");
          setSelectedStage(checklistData.stage_id || "");
          setCategory(checklistData.category || "");
          setCat1(checklistData.category_level1 || "");
          setCat2(checklistData.category_level2 || "");
          setCat3(checklistData.category_level3 || "");
          setCat4(checklistData.category_level4 || "");
          setCat5(checklistData.category_level5 || "");
          setCat6(checklistData.category_level6 || "");
          setSelectedBuilding(checklistData.building_id || "");
          setSelectedZone(checklistData.zone_id || "");
          setSelectedFlat(checklistData.flat_id || "");

          if (checklistData.items && checklistData.items.length > 0) {
            const formattedQuestions = checklistData.items.map((item) => ({
              question: item.title,
              options: item.options
                ? item.options.map((opt) => ({
                    value: opt.name,
                    submission: opt.choice,
                  }))
                : [],
              photo_required: item.photo_required || false,
            }));
            setQuestions(formattedQuestions);
          }
        } catch (error) {
          showToast("Failed to load checklist details", "error");
        }
      };

      fetchChecklistDetails();
    }
  }, [isEdit, checklist?.id]);

  useEffect(() => {
    if (!selectedBuilding) {
      setLevels([]);
      setZones([]);
      setFlats([]);
      setSelectedLevel("");
      setSelectedZone("");
      setSelectedFlat("");
      return;
    }
    const b = buildings.find((x) => String(x.id) === String(selectedBuilding));
    setLevels(b?.levels || []);
    setSelectedLevel("");
    setSelectedZone("");
    setSelectedFlat("");
    console.log("Levels for building", selectedBuilding, b?.levels || []);
  }, [selectedBuilding, buildings]);

  useEffect(() => {
    if (!selectedLevel) {
      setZones([]);
      setFlats([]);
      setSelectedZone("");
      setSelectedFlat("");
      return;
    }
    const l = levels.find((x) => String(x.id) === String(selectedLevel));
    setZones(l?.zones || []);
    setSelectedZone("");
    setSelectedFlat("");
    console.log("Zones for level", selectedLevel, l?.zones || []);
  }, [selectedLevel, levels]);

  useEffect(() => {
    if (!selectedZone) {
      setFlats([]);
      setSelectedFlat("");
      return;
    }
    const z = zones.find((x) => String(x.id) === String(selectedZone));
    setFlats(z?.flats || []);
    setSelectedFlat("");
    console.log("Flats for zone", selectedZone, z?.flats || []);
  }, [selectedZone, zones]);

  useEffect(() => {
    if (!selectedPurpose) {
      setPhases([]);
      setStages([]);
      setSelectedPhase("");
      setSelectedStage("");
      return;
    }
    getPhaseByPurposeId(selectedPurpose)
      .then((res) => setPhases(res.data || []))
      .catch(() => {
        showToast("Failed to load phases", "error");
        setPhases([]);
      });
    setStages([]);
    setSelectedPhase("");
    setSelectedStage("");
  }, [selectedPurpose]);

  useEffect(() => {
    if (!selectedPhase) {
      setStages([]);
      setSelectedStage("");
      return;
    }
    GetstagebyPhaseid(selectedPhase)
      .then((res) => setStages(res.data || []))
      .catch(() => {
        showToast("Failed to load stages");
        setStages([]);
      });
    setSelectedStage("");
  }, [selectedPhase]);

  // ALL EXISTING FUNCTIONS - NO CHANGES
  const handleQuestionOptionAdd = (qIdx) => {
    setQuestions((prev) => {
      const updated = [...prev];
      if (!updated[qIdx].options) {
        updated[qIdx].options = [];
      }
      updated[qIdx].options.push({ value: "", submission: "P" });
      return updated;
    });
  };

  const handleQuestionOptionChange = (qIdx, key, value, optIdx) => {
    setQuestions((prev) => {
      const updated = [...prev];
      if (!updated[qIdx].options) {
        updated[qIdx].options = [];
      }
      if (!updated[qIdx].options[optIdx]) {
        updated[qIdx].options[optIdx] = { value: "", submission: "P" };
      }
      updated[qIdx].options[optIdx][key] = value;
      return updated;
    });
  };

  const handleQuestionOptionRemove = (qIdx, optIdx) => {
    setQuestions((prev) => {
      const updated = [...prev];
      if (updated[qIdx].options && updated[qIdx].options.length > optIdx) {
        updated[qIdx].options = updated[qIdx].options.filter(
          (_, idx) => idx !== optIdx
        );
      }
      return updated;
    });
  };

  const handleAddMoreQuestions = () => {
    const toAdd = [];
    for (let i = 0; i < numOfQuestions; i++) {
      toAdd.push({
        question: "",
        options: [],
        photo_required: false,
      });
    }
    setQuestions([...questions, ...toAdd]);
  };

  const getLevelOptions = (levelKey) => {
    if (levelKey === 1) {
      return categoryTree;
    }
    if (levelKey === 2 && category) {
      return (
        categoryTree.find((cat) => String(cat.id) === String(category))
          ?.level1 || []
      );
    }
    if (levelKey === 3 && cat1) {
      const catObj = categoryTree.find(
        (cat) => String(cat.id) === String(category)
      );
      return (
        catObj?.level1.find((l1) => String(l1.id) === String(cat1))?.level2 ||
        []
      );
    }
    if (levelKey === 4 && cat2) {
      const catObj = categoryTree.find(
        (cat) => String(cat.id) === String(category)
      );
      const cat1Obj = catObj?.level1.find(
        (l1) => String(l1.id) === String(cat1)
      );
      return (
        cat1Obj?.level2.find((l2) => String(l2.id) === String(cat2))?.level3 ||
        []
      );
    }
    if (levelKey === 5 && cat3) {
      const catObj = categoryTree.find(
        (cat) => String(cat.id) === String(category)
      );
      const cat1Obj = catObj?.level1.find(
        (l1) => String(l1.id) === String(cat1)
      );
      const cat2Obj = cat1Obj?.level2.find(
        (l2) => String(l2.id) === String(cat2)
      );
      return (
        cat2Obj?.level3.find((l3) => String(l3.id) === String(cat3))?.level4 ||
        []
      );
    }
    if (levelKey === 6 && cat4) {
      const catObj = categoryTree.find(
        (cat) => String(cat.id) === String(category)
      );
      const cat1Obj = catObj?.level1.find(
        (l1) => String(l1.id) === String(cat1)
      );
      const cat2Obj = cat1Obj?.level2.find(
        (l2) => String(l2.id) === String(cat2)
      );
      const cat3Obj = cat2Obj?.level3.find(
        (l3) => String(l3.id) === String(cat3)
      );
      return (
        cat3Obj?.level4.find((l4) => String(l4.id) === String(cat4))?.level5 ||
        []
      );
    }
    return [];
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setCat1("");
    setCat2("");
    setCat3("");
    setCat4("");
    setCat5("");
    setCat6("");
  };
  const handleCat1Change = (e) => {
    setCat1(e.target.value);
    setCat2("");
    setCat3("");
    setCat4("");
    setCat5("");
    setCat6("");
  };
  const handleCat2Change = (e) => {
    setCat2(e.target.value);
    setCat3("");
    setCat4("");
    setCat5("");
    setCat6("");
  };
  const handleCat3Change = (e) => {
    setCat3(e.target.value);
    setCat4("");
    setCat5("");
    setCat6("");
  };
  const handleCat4Change = (e) => {
    setCat4(e.target.value);
    setCat5("");
    setCat6("");
  };
  const handleCat5Change = (e) => {
    setCat5(e.target.value);
    setCat6("");
  };
  const handleCat6Change = (e) => {
    setCat6(e.target.value);
  };

  // EXACT SAME LOGIC - handleCreateChecklist
  const handleCreateChecklist = async () => {
    if (!checklistName.trim()) return showToast("Checklist name required!");
    if (!projectId || projectId === "") return showToast("Select a project");
    if (!selectedPurpose || selectedPurpose === "")
      return showToast("Select a purpose");
    if (!category || category === "") return showToast("Select a category");
    if (!questions.length) return showToast("Add at least one question");

    const parsedProjectId = parseInt(projectId);
    const parsedPurposeId = parseInt(selectedPurpose);
    const parsedCategoryId = parseInt(category);

    if (isNaN(parsedProjectId)) return showToast("Invalid project selected");
    if (isNaN(parsedPurposeId)) return showToast("Invalid purpose selected");
    if (isNaN(parsedCategoryId)) return showToast("Invalid category selected");

    console.log("Project ID:", parsedProjectId);

    const checklistPayload = {
      name: checklistName,
      project_id: parsedProjectId,
      purpose_id: parsedPurposeId,
      phase_id:
        selectedPhase && selectedPhase !== "" ? parseInt(selectedPhase) : null,
      stage_id:
        selectedStage && selectedStage !== "" ? parseInt(selectedStage) : null,
      category: parsedCategoryId,
      category_level1: cat1 && cat1 !== "" ? parseInt(cat1) : null,
      category_level2: cat2 && cat2 !== "" ? parseInt(cat2) : null,
      category_level3: cat3 && cat3 !== "" ? parseInt(cat3) : null,
      category_level4: cat4 && cat4 !== "" ? parseInt(cat4) : null,
      category_level5: cat5 && cat5 !== "" ? parseInt(cat5) : null,
      category_level6: cat6 && cat6 !== "" ? parseInt(cat6) : null,
      building_id:
        selectedBuilding && selectedBuilding !== ""
          ? parseInt(selectedBuilding)
          : null,
      zone_id:
        selectedZone && selectedZone !== "" ? parseInt(selectedZone) : null,
      flat_id:
        selectedFlat && selectedFlat !== "" ? parseInt(selectedFlat) : null,
      remarks: "",
      not_initialized: skipInitializer,
    };

    console.log("=== CHECKLIST CREATION DEBUG ===");
    console.log("sendAllUnits:", sendAllUnits);
    console.log("isEdit:", isEdit);
    console.log("checklistPayload:", checklistPayload);

    try {
      console.log("Payload being sent:", checklistPayload);

      let checklistRes;
      let checklistId;

      if (isEdit && checklist?.id) {
        checklistRes = await updateChecklistById(
          checklist.id,
          checklistPayload
        );
        checklistId = checklist.id;
        showToast("Checklist updated successfully!", "success");
      } else {
        console.log(
          "🔍 Let's check what URL createChecklist function uses..."
        );
        console.log(
          "🔍 Look in Network tab when creating single checklist to see the exact URL"
        );
        if (sendAllUnits) {
          console.log("🚀 BULK CREATION MODE ACTIVATED");
          const bulkPayload = {
            ...checklistPayload,
            description: checklistPayload.remarks || "Bulk checklist creation",
            created_by_id: 1,
            items: questions.map((q) => ({
              title: q.question,
              description: q.question,
              status: "not_started",
              ignore_now: false,
              photo_required: q.photo_required || false,
              options: (q.options || [])
                .filter((opt) => opt.value && opt.value.trim() !== "")
                .map((opt) => ({
                  name: opt.value,
                  choice: opt.submission,
                })),
            })),
          };
          console.log("📦 Bulk Payload being sent:", bulkPayload);
          console.log("📦 Items count:", bulkPayload.items.length);
          console.log("📦 First item options:", bulkPayload.items[0]?.options);

          checklistRes = await axios.post(
            "https://konstruct.world/checklists/create/unit-chechklist/",
            bulkPayload,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log("✅ Bulk API Response:", checklistRes.data);
          console.log(
            "✅ Created checklist IDs:",
            checklistRes.data.checklist_ids
          );
          showToast(
            `Checklists created for all units successfully! Created ${
              checklistRes.data.checklist_ids?.length || 0
            } checklists`,
            "success"
          );
        } else {
          console.log("🎯 SINGLE CREATION MODE");
          checklistRes = await createChecklist(checklistPayload);
          checklistId =
            checklistRes.data?.id ||
            checklistRes.data?.pk ||
            checklistRes.data?.ID;
          showToast("Checklist created successfully!", "success");
        }
      }

      if (
        checklistRes.status === 201 ||
        checklistRes.status === 200 ||
        checklistRes.data?.id ||
        checklistRes.data?.checklist_ids
      ) {
        console.log("🎉 SUCCESS CONDITION MET");
        console.log("Response status:", checklistRes.status);
        console.log("Has single ID:", !!checklistRes.data?.id);
        console.log("Has bulk IDs:", !!checklistRes.data?.checklist_ids);

        if (!sendAllUnits && !isEdit) {
          for (let i = 0; i < questions.length; i++) {
            const q = questions[i];

            const itemRes = await createChecklistQuestion({
              checklist: checklistId,
              title: q.question,
              photo_required: q.photo_required || false,
              is_done: false,
            });

            const checklistItemId = itemRes.data?.id;

            if (checklistItemId && q.options?.length) {
              for (let option of q.options) {
                if (option.value && option.value.trim() !== "") {
                  await createChecklistItemOPTIONSS({
                    checklist_item: checklistItemId,
                    name: option.value,
                    choice: option.submission,
                  });
                }
              }
            }
          }
        }

        if (
          !isEdit &&
          onChecklistCreated &&
          typeof onChecklistCreated === "function"
        ) {
          if (sendAllUnits) {
            console.log("📤 Calling callback for BULK creation");
            const createdChecklistData = {
              ...checklistPayload,
              id: checklistRes.data?.checklist_ids?.[0] || null,
              project_id: parsedProjectId,
              category_id: parsedCategoryId,
              is_bulk: true,
              checklist_count: checklistRes.data?.checklist_ids?.length || 0,
            };
            console.log("📤 Bulk callback data:", createdChecklistData);
            onChecklistCreated(createdChecklistData);
          } else {
            const createdChecklistData = {
              ...checklistPayload,
              id: checklistId,
              project_id: parsedProjectId,
              category_id: parsedCategoryId,
            };
            console.log("📤 Single callback data:", createdChecklistData);
            onChecklistCreated(createdChecklistData);
          }
        }

        setShowForm(false);
      } else {
        console.error("Checklist creation failed:", checklistRes);
        showToast(
          checklistRes.data?.message || "Failed to create checklist",
          "error"
        );
      }
    } catch (error) {
      console.error("Error creating checklist:", "error");

      if (error.response) {
        console.error("Error response:", error.response.data);
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.detail ||
          `Server error: ${error.response.status}`;
        showToast(errorMessage);
      } else {
        showToast(
          "Failed to create checklist and questions. Please try again.",
          "error"
        );
      }
    }
  };

  // EXACT SAME BULK UPLOAD FUNCTION
  const handleBulkUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const bulkQuestions = [];

        jsonData.forEach((row) => {
          const question = row["Question"] || row["question"] || "";
          const optionsString = row["Options"] || row["options"] || "";
          const photoRequired =
            row["PhotoRequired"] || row["photo_required"] || false;

          const options = [];
          if (optionsString) {
            const optionPairs = optionsString.split("|");
            optionPairs.forEach((pair) => {
              const match = pair.match(/^(.+)\(([PN])\)$/);
              if (match) {
                options.push({
                  value: match[1].trim(),
                  submission: match[2],
                });
              }
            });
          }

          if (question.trim()) {
            bulkQuestions.push({
              question: question.trim(),
              options: options,
              photo_required:
                photoRequired === true ||
                photoRequired === "true" ||
                photoRequired === "True",
            });
          }
        });

        if (bulkQuestions.length > 0) {
          setQuestions([...questions, ...bulkQuestions]);
          showToast(
            `${bulkQuestions.length} questions uploaded successfully!`,
            "success"
          );
        } else {
          showToast("No valid questions found in the file", "error");
        }

        event.target.value = "";
      } catch (error) {
        showToast("Error reading file. Please check the format.", "error");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex min-h-screen" style={{ background: palette.bg }}>
      <SideBarSetup />
      <div className="flex-1 p-4 lg:p-8 ml-[250px] lg:ml-[16%]">
        <div
          className={`w-full max-w-7xl mx-auto p-4 lg:p-8 rounded-2xl ${palette.card} ${palette.shadow} border ${palette.border}`}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${palette.primary}`}>
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className={`text-3xl font-bold ${palette.text}`}>
                    {isEdit ? "Edit Checklist" : "Create New Checklist"}
                  </h1>
                  <p className={`${palette.textSecondary} text-lg mt-1`}>
                    {isEdit
                      ? "Update checklist details and questions"
                      : "Build comprehensive checklists for your projects"}
                  </p>
                </div>
              </div>
              <button
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${palette.secondary} flex items-center space-x-2`}
                onClick={() => setShowForm(false)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>Back</span>
              </button>
            </div>
          </div>
          {/* Apply to All Units & Template & Skip Initializer - IN SAME LINE */}
          <div className="mb-8 flex flex-col lg:flex-row gap-4">
            {/* Apply to All Units Toggle */}
            <div
              className={`flex-1 p-6 rounded-xl border-2 transition-all duration-300 ${palette.card} ${palette.border}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${palette.primary}`}>
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0V9a1 1 0 011-1h4a1 1 0 011 1v12"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`${palette.text} font-bold text-xl`}>
                      Apply to All Units
                    </h3>
                  </div>
                </div>
                <button
                  className={`px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 flex items-center space-x-3 ${
                    sendAllUnits ? palette.success : palette.primary
                  }`}
                  type="button"
                  onClick={() => {
                    console.log(
                      "🎯 Apply to All Units button clicked. Current state:",
                      sendAllUnits
                    );
                    setSendAllUnits(!sendAllUnits);
                    console.log("🎯 New state will be:", !sendAllUnits);
                  }}
                >
                  {sendAllUnits ? (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>✓ Enabled</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0V9a1 1 0 011-1h4a1 1 0 011 1v12"
                        />
                      </svg>
                      <span>Enable</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Template Download */}
            <div
              className={`flex-1 p-6 rounded-xl border-2 transition-all duration-300 ${palette.card} ${palette.border}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${palette.info}`}>
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`${palette.text} font-bold text-xl`}>
                      Questions Template
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href =
                      'data:text/plain;charset=utf-8,Question,Options,PhotoRequired\n"What is the quality?","Good(P)|Bad(N)|Average(P)",false\n"Check alignment","Aligned(P)|Not Aligned(N)",true';
                    link.download = "questions_template.csv";
                    link.click();
                  }}
                  className={`px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 flex items-center space-x-3 ${palette.info}`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Skip Initializer */}
            <div
              className={`flex-1 p-6 rounded-xl border-2 transition-all duration-300 ${palette.card} ${palette.border}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${palette.warning}`}>
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`${palette.text} font-bold text-xl`}>
                      Skip Initializer
                    </h3>
                  </div>
                </div>
                <button
                  className={`px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 flex items-center space-x-3 ${
                    skipInitializer ? palette.success : palette.warning
                  }`}
                  type="button"
                  onClick={() => setSkipInitializer(!skipInitializer)}
                >
                  {skipInitializer ? (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>✓ Enabled</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span>Enable</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Checklist Name Input */}
          <div className="mb-8">
            <label
              className={`block font-bold text-xl mb-3 ${palette.text} flex items-center space-x-3`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <span>
                Checklist Name <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="text"
              className={`w-full p-4 border-2 rounded-xl transition-all duration-300 focus:ring-4 ${palette.selectBg} ${palette.selectText} ${palette.border} font-medium text-lg`}
              placeholder="Enter a descriptive name for your checklist"
              value={checklistName}
              onChange={(e) => setChecklistName(e.target.value)}
              required
            />
          </div>

          {/* Show the checklist name as heading if filled */}
          {checklistName && (
            <div
              className={`mb-6 p-4 rounded-xl border-2 text-xl font-bold text-center ${palette.badge} ${palette.badgeText} border-current`}
            >
              📋 {checklistName}
            </div>
          )}

          {/* Flat name display */}
          {selectedFlatObj && (
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-300 text-lg font-bold text-blue-800 text-center">
              🏠 Selected Flat: {selectedFlatObj.number}
            </div>
          )}

          {/* Project & Hierarchy Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Project Dropdown */}
            <div>
              <label
                className={`block text-lg font-semibold mb-3 ${palette.text} flex items-center space-x-3`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0V9a1 1 0 011-1h4a1 1 0 011 1v12"
                  />
                </svg>
                <span>
                  Project <span className="text-red-500">*</span>
                </span>
              </label>
              <select
                className={`w-full p-4 border-2 rounded-xl transition-all duration-300 focus:ring-4 ${palette.selectBg} ${palette.selectText} ${palette.border} font-medium`}
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              >
                <option value="">Select Project</option>
                {(Array.isArray(projectOptions) ? projectOptions : []).map(
                  (proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.name}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Building Dropdown */}
            {buildings.length > 0 && (
              <div>
                <label
                  className={`block text-lg font-semibold mb-3 ${palette.text} flex items-center space-x-3`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                    />
                  </svg>
                  <span>Tower / Building</span>
                </label>
                <select
                  className={`w-full p-4 border-2 rounded-xl transition-all duration-300 focus:ring-4 ${palette.selectBg} ${palette.selectText} ${palette.border} font-medium`}
                  value={selectedBuilding}
                  onChange={(e) => {
                    setSelectedBuilding(e.target.value);
                    console.log("Building selected:", e.target.value);
                  }}
                >
                  <option value="">Select Building</option>
                  {(Array.isArray(buildings) ? buildings : []).map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Level Dropdown */}
            {levels.length > 0 && (
              <div>
                <label
                  className={`block text-lg font-semibold mb-3 ${palette.text} flex items-center space-x-3`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8l4-4 4 4m-4-4v12"
                    />
                  </svg>
                  <span>Level</span>
                </label>
                <select
                  className={`w-full p-4 border-2 rounded-xl transition-all duration-300 focus:ring-4 ${palette.selectBg} ${palette.selectText} ${palette.border} font-medium`}
                  value={selectedLevel}
                  onChange={(e) => {
                    setSelectedLevel(e.target.value);
                    console.log("Level selected:", e.target.value);
                  }}
                >
                  <option value="">Select Level</option>
                  {levels.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Zone Dropdown */}
            {zones.length > 0 && (
              <div>
                <label
                  className={`block text-lg font-semibold mb-3 ${palette.text} flex items-center space-x-3`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Zone</span>
                </label>
                <select
                  className={`w-full p-4 border-2 rounded-xl transition-all duration-300 focus:ring-4 ${palette.selectBg} ${palette.selectText} ${palette.border} font-medium`}
                  value={selectedZone}
                  onChange={(e) => {
                    setSelectedZone(e.target.value);
                    console.log("Zone selected:", e.target.value);
                  }}
                >
                  <option value="">Select Zone</option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Flat Dropdown */}
            {flats.length > 0 && (
              <div>
                <label
                  className={`block text-lg font-semibold mb-3 ${palette.text} flex items-center space-x-3`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4"
                    />
                  </svg>
                  <span>Flat</span>
                </label>
                <select
                  className={`w-full p-4 border-2 rounded-xl transition-all duration-300 focus:ring-4 ${palette.selectBg} ${palette.selectText} ${palette.border} font-medium`}
                  value={selectedFlat}
                  onChange={(e) => {
                    setSelectedFlat(e.target.value);
                    console.log("Flat selected:", e.target.value);
                  }}
                >
                  <option value="">Select Flat</option>
                  {flats.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.number}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Purpose Dropdown */}
            {purposes.length > 0 && (
              <div>
                <label
                  className={`block text-lg font-semibold mb-3 ${palette.text} flex items-center space-x-3`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  <span>
                    Purpose <span className="text-red-500">*</span>
                  </span>
                </label>
                <select
                  className={`w-full p-4 border-2 rounded-xl transition-all duration-300 focus:ring-4 ${palette.selectBg} ${palette.selectText} ${palette.border} font-medium`}
                  value={selectedPurpose}
                  onChange={(e) => setSelectedPurpose(e.target.value)}
                >
                  <option value="">Select Purpose</option>
                  {purposes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Phase Dropdown */}
            {phases.length > 0 && (
              <div>
                <label
                  className={`block text-lg font-semibold mb-3 ${palette.text} flex items-center space-x-3`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Phase</span>
                </label>
                <select
                  className={`w-full p-4 border-2 rounded-xl transition-all duration-300 focus:ring-4 ${palette.selectBg} ${palette.selectText} ${palette.border} font-medium`}
                  value={selectedPhase}
                  onChange={(e) => setSelectedPhase(e.target.value)}
                >
                  <option value="">Select Phase</option>
                  {phases.map((ph) => (
                    <option key={ph.id} value={ph.id}>
                      {ph.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Stage Dropdown */}
            {stages.length > 0 && (
              <div>
                <label
                  className={`block text-lg font-semibold mb-3 ${palette.text} flex items-center space-x-3`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span>Stage</span>
                </label>
                <select
                  className={`w-full p-4 border-2 rounded-xl transition-all duration-300 focus:ring-4 ${palette.selectBg} ${palette.selectText} ${palette.border} font-medium`}
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                >
                  <option value="">Select Stage</option>
                  {stages.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Category Level 1 */}
            <div>
              <label
                className={`block text-lg font-semibold mb-3 ${palette.text} flex items-center space-x-3`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <span>
                  Category <span className="text-red-500">*</span>
                </span>
              </label>
              <select
                className={`w-full p-4 border-2 rounded-xl transition-all duration-300 focus:ring-4 ${palette.selectBg} ${palette.selectText} ${palette.border} font-medium`}
                value={category}
                onChange={handleCategoryChange}
              >
                <option value="">Select Category</option>
                {getLevelOptions(1).map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Level 2 */}
            {getLevelOptions(2).length > 0 && (
              <div>
                <label
                  className={`block text-lg font-semibold mb-3 ${palette.text} flex items-center space-x-3`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span>Category Level 4</span>
                </label>
                <select
                  className={`w-full p-4 border-2 rounded-xl transition-all duration-300 focus:ring-4 ${palette.selectBg} ${palette.selectText} ${palette.border} font-medium`}
                  value={cat3}
                  onChange={handleCat3Change}
                >
                  <option value="">Select Level 4</option>
                  {getLevelOptions(4).map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Category Level 5 */}
            {getLevelOptions(5).length > 0 && (
              <div>
                <label
                  className={`block text-lg font-semibold mb-3 ${palette.text} flex items-center space-x-3`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span>Category Level 5</span>
                </label>
                <select
                  className={`w-full p-4 border-2 rounded-xl transition-all duration-300 focus:ring-4 ${palette.selectBg} ${palette.selectText} ${palette.border} font-medium`}
                  value={cat4}
                  onChange={handleCat4Change}
                >
                  <option value="">Select Level 5</option>
                  {getLevelOptions(5).map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Category Level 6 */}
            {getLevelOptions(6).length > 0 && (
              <div>
                <label
                  className={`block text-lg font-semibold mb-3 ${palette.text} flex items-center space-x-3`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span>Category Level 6</span>
                </label>
                <select
                  className={`w-full p-4 border-2 rounded-xl transition-all duration-300 focus:ring-4 ${palette.selectBg} ${palette.selectText} ${palette.border} font-medium`}
                  value={cat5}
                  onChange={handleCat5Change}
                >
                  <option value="">Select Level 6</option>
                  {getLevelOptions(6).map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Questions Section */}
          <div className="mb-8">
            <div className="mb-6">
              <h2
                className={`text-2xl font-bold mb-4 ${palette.text} flex items-center space-x-3`}
              >
                <div className={`p-3 rounded-xl ${palette.primary}`}>
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span>Questions & Options</span>
              </h2>
            </div>

            {/* Add Questions Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-1">
                <label
                  className={`block text-lg font-semibold mb-3 ${palette.text}`}
                >
                  Add Questions
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    className={`w-full p-3 border-2 rounded-xl transition-all duration-300 focus:ring-4 ${palette.selectBg} ${palette.selectText} ${palette.border} font-medium`}
                    min={1}
                    value={numOfQuestions}
                    onChange={(e) => setNumOfQuestions(Number(e.target.value))}
                  />
                  <button
                    onClick={handleAddMoreQuestions}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${palette.success} flex items-center space-x-2`}
                  >
                    <MdAdd size={20} />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Bulk Upload */}
              <div className="lg:col-span-2">
                <label
                  className={`block text-lg font-semibold mb-3 ${palette.text}`}
                >
                  Bulk Upload Questions
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleBulkUpload}
                  className={`w-full p-3 border-2 rounded-xl transition-all duration-300 focus:ring-4 ${palette.selectBg} ${palette.selectText} ${palette.border} font-medium`}
                />
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {questions.map((q, qIdx) => (
                <div
                  key={qIdx}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] ${palette.card} ${palette.border} ${palette.shadow}`}
                  style={{
                    borderLeft: `6px solid ${
                      theme === "dark" ? "#fbbf24" : "#f97316"
                    }`,
                  }}
                >
                  <div className="flex items-center gap-6 mb-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${palette.badge} ${palette.badgeText}`}
                    >
                      {qIdx + 1}
                    </div>
                    <input
                      type="text"
                      placeholder={`Enter your question ${qIdx + 1}`}
                      className={`flex-1 p-4 border-2 rounded-xl transition-all duration-300 focus:ring-4 ${palette.selectBg} ${palette.selectText} ${palette.border} font-medium text-lg`}
                      value={q.question}
                      onChange={(e) =>
                        setQuestions((prev) => {
                          const updated = [...prev];
                          updated[qIdx] = {
                            ...updated[qIdx],
                            question: e.target.value,
                          };
                          return updated;
                        })
                      }
                    />

                    {/* Photo Required Toggle */}
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!q.photo_required}
                        onChange={(e) =>
                          setQuestions((prev) => {
                            const updated = [...prev];
                            updated[qIdx] = {
                              ...updated[qIdx],
                              photo_required: e.target.checked,
                            };
                            return updated;
                          })
                        }
                        className="w-5 h-5 text-purple-600 bg-white border-2 border-purple-300 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-5 h-5 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="font-semibold text-purple-800">
                          Photo Required
                        </span>
                      </div>
                    </label>

                    <button
                      className={`p-3 rounded-xl transition-all duration-200 hover:scale-110 ${palette.danger}`}
                      onClick={() => {
                        if (questions.length === 1) {
                          showToast(
                            "At least one question is required",
                            "error"
                          );
                          return;
                        }
                        setQuestions(
                          questions.filter((_, idx) => idx !== qIdx)
                        );
                      }}
                      title="Remove Question"
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>

                  {/* Options */}
                  <div className="ml-18 space-y-3">
                    <div className="flex flex-wrap gap-3">
                      {(q.options || []).map((option, optIdx) => (
                        <div
                          key={optIdx}
                          className="flex items-center gap-3 p-3 border-2 border-gray-300 rounded-xl bg-white"
                        >
                          <input
                            type="text"
                            placeholder="Add Option"
                            className="flex-1 outline-none border-none font-medium"
                            value={option.value || ""}
                            onChange={(e) =>
                              handleQuestionOptionChange(
                                qIdx,
                                "value",
                                e.target.value,
                                optIdx
                              )
                            }
                          />
                          <select
                            value={option.submission || "P"}
                            onChange={(e) =>
                              handleQuestionOptionChange(
                                qIdx,
                                "submission",
                                e.target.value,
                                optIdx
                              )
                            }
                            className={`px-3 py-2 rounded-lg font-bold text-white border-none ${
                              option.submission === "P"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          >
                            <option value="P">P</option>
                            <option value="N">N</option>
                          </select>
                          <button
                            className="text-red-600 hover:text-red-800 p-1"
                            onClick={() =>
                              handleQuestionOptionRemove(qIdx, optIdx)
                            }
                            title="Remove Option"
                          >
                            <MdDelete size={18} />
                          </button>
                        </div>
                      ))}
                      <button
                        className={`px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105 ${palette.primary} flex items-center space-x-2`}
                        onClick={() => handleQuestionOptionAdd(qIdx)}
                        type="button"
                      >
                        <MdAdd size={18} />
                        <span>Add Option</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Create Button */}
          {/* Create Button */}
          <div className="flex justify-center">
            <button
              className={`px-12 py-4 rounded-xl font-bold text-xl transition-all duration-300 hover:scale-105 ${palette.primary} flex items-center space-x-4 shadow-lg`}
              onClick={handleCreateChecklist}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              <span>{isEdit ? "Update Checklist" : "Create Checklist"}</span>
            </button>
          </div>

          {/* Bulk Creation Overlay Notification */}
          {sendAllUnits && (
            <div className="fixed top-4 right-4 z-50 animate-pulse">
              <div
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-emerald-900/90 border-emerald-500/50 text-emerald-200"
                    : "bg-emerald-50/90 border-emerald-300 text-emerald-800"
                } backdrop-blur-sm shadow-lg`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-full ${
                      palette.success.split(" ")[0]
                    } ${palette.success.split(" ")[1]}`}
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Bulk Creation Mode Enabled</p>
                    <p className="text-sm opacity-80">
                      Will create for all units at selected level
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChecklistForm;