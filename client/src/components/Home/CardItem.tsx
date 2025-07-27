import { Card, Space, Typography } from "antd";
import { FC, ReactNode } from "react";
import { useNavigate } from "react-router";
const { Title } = Typography;

const CardItem: FC<{
  title: string;
  icon: ReactNode;
  link: string;
}> = ({ icon, title, link }) => {
  const navigate = useNavigate();

  const handleClickOnCard = () => {
    navigate(link);
  };

  return (
    <Card
      hoverable
      onClick={handleClickOnCard}
      style={{
        cursor: "pointer",
        width: 290,
        height: 290,
        textAlign: "center",
      }}
    >
      <Space style={{ margin: 45 }}>{icon}</Space>
      <Title level={4}>{title}</Title>
    </Card>
  );
};
export default CardItem;
