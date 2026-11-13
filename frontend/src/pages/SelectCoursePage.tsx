import { useNavigate } from "react-router-dom";
import WelcomeScreen from "../components/WelcomeScreen";
import { getSavedContext, useContext } from "../useContext";
import type { CourseId, Semester } from "../types";

export default function SelectCoursePage() {
  const navigate = useNavigate();
  const { update, courses } = useContext();
  const saved = getSavedContext();

  const handleContinue = (course: CourseId, semester: Semester) => {
    update(course, semester);
    navigate("/", { replace: true });
  };

  return (
    <WelcomeScreen
      courses={courses}
      initialCourse={saved?.course}
      initialSemester={saved?.semester}
      onContinue={handleContinue}
    />
  );
}
