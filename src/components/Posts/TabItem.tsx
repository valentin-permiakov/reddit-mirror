import { Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";

type TabItemProps = {
  icon: IconType;
  title: string;
  selected: boolean;
  setSelectedTab: (value: string) => void;
};

const TabItem: React.FC<TabItemProps> = ({
  icon,
  title,
  selected,
  setSelectedTab,
}) => {
  return (
    <Flex
      justify="center"
      align="center"
      flexGrow={1}
      p="14px 0"
      cursor="pointer"
      borderWidth={selected ? "0 1px 2px 0" : "0 1px 1px 0"}
      borderBottomColor={selected ? "blue.500" : "gray.200"}
      borderRightColor="gray.200"
      color={selected ? "blue.500" : "gray.500"}
      fontWeight={700}
      _hover={{ bg: "gray.100" }}
      onClick={() => setSelectedTab(title)}
    >
      <Flex align="center" height="20px" mr={2}>
        <Icon as={icon} />
      </Flex>
      <Text fontSize="10pt">{title}</Text>
    </Flex>
  );
};
export default TabItem;
