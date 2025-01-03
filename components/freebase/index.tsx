import { usePoolData, useRewards, useRewardTokens, useUserPoolPositions } from "@/hooks/useFreebaseUser";
import { Box, Grid, Text, Flex } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { type Address } from "viem";
import { PoolCard } from "./pool-card";


export function UserDashboard() {
  const { address } = useAccount();
  const { pools } = usePoolData();
  const { userPoolPositions } = useUserPoolPositions(address as Address);
  const { unclaimedRewards } = useRewards(address as Address);
  const { rewardTokens } = useRewardTokens();

  return (
    <Box>
      <Flex
        px={{ base: "4", md: "8" }}
        alignItems="center"
        borderBottom="1px solid #E9BDBD"
      >
        <Text
          as="h2"
          fontSize={{ base: "20px", sm: "24px" }}
        >
          Freebase Pools
        </Text>
      </Flex>

      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(auto-fit, minmax(300px, 1fr))"
        }}
        gap={4}
        p={6}
      >
        {pools?.map((pool) => {
          const userPoolPosition = userPoolPositions?.find((position) => Number(position.pool.id) === pool.id);

          return (<PoolCard
            rewardTokens={rewardTokens}
            key={pool.id}
            pool={pool}
            userAddress={address}
            userPoolPosition={userPoolPosition}
          />)
        })}
      </Grid>
    </Box>
  );
};

export default UserDashboard;