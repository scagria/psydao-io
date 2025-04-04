import { Box, FormLabel, Input, Button, VStack, Text } from "@chakra-ui/react";
import { useGlobalStats } from "@/hooks/useFreebaseUser";
import { formatEther } from "viem";
import { useEffect, useState } from "react";

interface SetRewardPerBlockProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isPending: boolean;
}

export default function SetRewardPerBlock({
  value,
  onChange,
  onSubmit,
  isPending
}: SetRewardPerBlockProps) {
  const { globalStats } = useGlobalStats();

  return (
    <VStack align="stretch" spacing={4}>
      <FormLabel fontSize="18" mb="0" fontFamily="Inter">
        Reward Per Block
      </FormLabel>
      {globalStats?.length && (
        <Text>
          Current Rewards Per block:{" "}
          {formatEther(BigInt(globalStats[0]?.rewardPerBlock ?? "0") ?? 0n)}
        </Text>
      )}
      <Box bg="#FBF6F8" borderRadius="xl" boxShadow="inner" p="16px">
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter amount"
          w={{ base: "100%", md: "200px" }}
          border="none"
          focusBorderColor="transparent"
          fontFamily="Inter"
        />
      </Box>

      <Button
        onClick={onSubmit}
        bg="linear-gradient(90deg, #f3a6a6, #f77cc2)"
        color="black"
        borderRadius="20px"
        px={6}
        py={2}
        fontSize="16px"
        fontWeight="bold"
        _hover={{ opacity: 0.8 }}
        isLoading={isPending}
        isDisabled={isPending}
      >
        {isPending ? "Updating..." : "Update"}
      </Button>
    </VStack>
  );
}
